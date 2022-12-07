package main

import (
	"fmt"
	"math/rand"
	"net/http"
	"strings"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/golang-jwt/jwt"
)

type LoginBody struct {
	Username string `json:"username"`
	Password string `json:"password"`
}

type GuessedNumber struct {
	GuessedNumber int `json:"GuessedNumber"`
}

var randomNumber int = rand.Intn(100)
var sampleSecretKey = []byte("SecretYouShouldHide")

func generateJWT() (string, error) {
	token := jwt.New(jwt.SigningMethodEdDSA)
	tokenString, err := token.SignedString(sampleSecretKey)
	if err != nil {
		return "", err
	}

	return tokenString, nil
}

func validateToken(token string) error {
	_, err := jwt.Parse(token, func(t *jwt.Token) (interface{}, error) {
		if _, ok := t.Method.(*jwt.SigningMethodHMAC); !ok {
			return nil, fmt.Errorf("unexpected signing method: %v", t.Header["alg"])
		}

		return []byte("MySignature"), nil
	})

	return err
}

func loginUser(c *gin.Context) {
	var userInput LoginBody

	if err := c.BindJSON(&userInput); err != nil {
		return
	}

	if userInput.Password != "" {
		token := jwt.NewWithClaims(jwt.SigningMethodHS256, &jwt.StandardClaims{
			ExpiresAt: time.Now().Add(5 * time.Minute).Unix(),
		})

		ss, err := token.SignedString([]byte("MySignature"))
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{
				"error": err.Error(),
			})
		}

		c.JSON(http.StatusOK, gin.H{
			"token": ss,
		})
	}

}

func getNumber(c *gin.Context) {
	c.JSON(http.StatusOK, gin.H{
		"randomNumber": randomNumber,
	})
}

func guessNumber(c *gin.Context) {
	s := c.Request.Header.Get("Authorization")

	token := strings.TrimPrefix(s, "Bearer ")

	if err := validateToken(token); err != nil {
		c.AbortWithStatus(http.StatusUnauthorized)
		return
	}

	var inputNumber GuessedNumber

	if err := c.BindJSON(&inputNumber); err != nil {
		return 
	}

	if inputNumber.GuessedNumber == randomNumber {
		c.JSON(http.StatusCreated, "Guess correct")
		randomNumber = rand.Intn(100)
	} else {
		c.JSON(http.StatusBadRequest, "Wrong Answer")
	}
}

func main() {
	router := gin.Default()
	router.GET("/number", getNumber)
	router.POST("/login", loginUser)
	router.POST("/guess", guessNumber)

	router.Run("localhost:8000")
}