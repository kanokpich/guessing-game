package main

import (
	"math/rand"
	"net/http"

	"github.com/gin-gonic/gin"
)

type LoginBody struct {
	Username string `json:"username"`
	Password string `json:"password"`
}

type AuthTokenDta struct {
	AuthToken string `json:"authToken"`
}

type LoginResponse struct {
	Data AuthTokenDta `json:"data"`
}

type GuessedNumber struct {
	GuessedNumber int `json:"GuessedNumber"`
}

var randomNumber int = rand.Intn(100)

func getNumber(c *gin.Context) {
	c.IndentedJSON(http.StatusOK, randomNumber)
}

func guessNumber(c *gin.Context) {
	var inputNumber GuessedNumber

	if err := c.BindJSON(&inputNumber); err != nil {
		return 
	}

	if inputNumber.GuessedNumber == randomNumber {
		c.IndentedJSON(http.StatusCreated, "Guess correct")
		randomNumber = rand.Intn(100)
	}
}

func main() {
	router := gin.Default()
	router.GET("/number", getNumber)
	router.POST("/guess", guessNumber)

	router.Run("localhost:8000")
}