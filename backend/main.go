package main

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

func main() {
}