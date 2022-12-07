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
	} else {
		c.JSON(http.StatusBadRequest, "No password")
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
		c.JSON(http.StatusOK, "Wrong Answer")
	}
}

func CORS() gin.HandlerFunc {
	return func(c *gin.Context) {
		c.Writer.Header().Set("Access-Control-Allow-Origin", "http://localhost:3000")
		c.Writer.Header().Set("Access-Control-Allow-Credentials", "true")
		c.Writer.Header().Set("Access-Control-Allow-Headers", "Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers, Authorization")
		c.Writer.Header().Set("Access-Control-Allow-Methods", "GET, HEAD, POST, PUT, DELETE, OPTIONS, PATCH")

		if c.Request.Method == "OPTIONS" {
			c.AbortWithStatus(204)
			return
		}

		c.Next()
	}
}

func main() {
	router := gin.Default()
	router.Use(CORS())
	router.GET("/number", getNumber)
	router.POST("/login", loginUser)
	router.POST("/guess", guessNumber)

	router.Run("localhost:8080")
}