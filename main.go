package main

import (
	"flag"
	"fmt"
	"os"

	"github.com/fluhus/gostuff/nlp/wordnet"
	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/contrib/static"
	"github.com/gin-gonic/gin"
)

var words []string
var puzzleCache Puzzle
var wn *wordnet.WordNet

func getPuzzle(c *gin.Context) {
	date := getDate()
	puzzle := Puzzle{
		Words: words,
		Seed:  date.UnixMilli(),
		WN:    wn,
	}
	puzzle.Generate()
	puzzleCache = puzzle

	c.JSON(200, gin.H{
		"board": puzzle.board,
		"hint1": puzzle.Word1.Desc,
		"hint2": puzzle.Word2.Desc,
	})
}

func checkWords(c *gin.Context) {
	word1 := puzzleCache.Word1
	word2 := puzzleCache.Word2

	postedWords := make([]string, 0)

	if c.BindJSON(&postedWords) != nil || len(postedWords) == 0 {
		c.JSON(200, gin.H{
			"word1": false,
			"word2": false,
		})
		return
	}

	fmt.Println(word1, word2, postedWords)

	c.JSON(200, gin.H{
		"word1": checkIfStrInArr(word1.Word, postedWords),
		"word2": checkIfStrInArr(word2.Word, postedWords),
	})
}

func main() {
	isDevPtr := flag.Bool("dev", false, "Are we in a development environment?")
	exploseGlobalPtr := flag.Bool("expose", false, "Expose the app on 0.0.0.0.")
	flag.Parse()

	os.Setenv("TZ", "America/New_York")

	fmt.Println("Word game server")

	router := gin.Default()

	addr := "127.0.0.1"
	allowedHosts, _ := getAllowedHosts()

	if *isDevPtr {
		fmt.Println("Development mode")

		addr = "0.0.0.0"
		router.Use(cors.New(cors.Config{
			AllowOrigins:  allowedHosts,
			AllowMethods:  []string{"GET", "POST", "OPTIONS"},
			AllowHeaders:  []string{"Origin", "Content-Type"},
			ExposeHeaders: []string{"Content-Length"},
		}))
	} else {
		if *exploseGlobalPtr {
			addr = "0.0.0.0"
		}

		router.Use(static.Serve("/", static.LocalFile("./build", true)))
	}

	router.GET("/get-puzzle", getPuzzle)
	router.POST("/check", checkWords)

	err := readJSONFile("./words_dictionary.json", &words)

	if err != nil {
		fmt.Println(err)
	}

	// Initialize WordNet
	wn, err = wordnet.Parse("./dict")

	if err != nil {
		fmt.Println(err)
		return
	}

	fmt.Printf("Loaded %d words.\n", len(words))

	router.Run(addr + ":8383")
}
