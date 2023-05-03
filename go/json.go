package main

import(
	"fmt"
	"encoding/json"
)

type Sample struct {
	Hoge int `json:"hoge"`
	Fuga string `json:"fuga"`
}

func mapJson() {
	str := `{"hoge":1,"fuga":"piyo"}`
	var data map[string]interface{}
	if err := json.Unmarshal([]byte(str), &data); err != nil {
		panic(err)
	}

	fmt.Printf("%#v\n", data)
}

func sliceJson() {
	str := `[{"hoge":1,"fuga":"piyo"},{"hoge":2,"fuga":"piyopiyo"}]`
	var data []map[string]interface{}
	if err := json.Unmarshal([]byte(str), &data); err != nil {
		panic(err)
	}

	fmt.Printf("%#v\n", data)
}

func main() {
	mapJson()
	sliceJson()
}
