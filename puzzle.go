package main

import (
	"fmt"
	"math/rand"

	"github.com/fluhus/gostuff/nlp/wordnet"
)

type Puzzle struct {
	Words []string
	Seed  int64
	board []string
	WN    *wordnet.WordNet
	Word1 *Word
	Word2 *Word
}

func (p *Puzzle) getEmptyIndexes(letters ...string) []int {
	indexes := make([]int, 0)

	for i, l := range p.board {
		if l == "" || (len(letters) > 0 && l == letters[0]) {
			indexes = append(indexes, i)
		}
	}

	return indexes
}

func (p *Puzzle) placeWord(word string, lastPos int, positions []int) bool {
	if len(word) == 0 {
		return true
	}

	if lastPos < 0 {
		pos := -1
		posibleIdxs := p.getEmptyIndexes(word[:1])

		for tempPos := -1; len(posibleIdxs) > 0; tempPos = posibleIdxs[rand.Intn(len(posibleIdxs))] {
			if tempPos < 0 {
				continue
			}

			if p.board[tempPos] == "" || p.board[tempPos] == word[:1] {
				pos = tempPos
				break
			}
		}

		if pos < 0 {
			return false
		}

		p.board[pos] = string(word[0])

		if !p.placeWord(word[1:], pos, append(positions, pos)) {
			p.board[pos] = ""
			return false
		}
	} else {
		possibleSteps := getPossibleSteps(lastPos)

		for i := 0; i < len(possibleSteps); i++ {
			step := possibleSteps[i]
			cell := p.board[step]

			if (cell != "" && cell != string(word[0])) || checkIfIntInArr(step, positions) {
				possibleSteps = removeIndex(possibleSteps, i)
				i--
				continue
			}
		}

		if len(possibleSteps) == 0 {
			return false
		}

		for _, step := range possibleSteps {
			hasSameLetter := p.board[step] == word[:1]
			p.board[step] = word[:1]

			if p.placeWord(word[1:], step, append(positions, step)) {
				return true
			}

			if !hasSameLetter {
				p.board[step] = ""
			}
		}

		return false
	}

	return true
}

func (p *Puzzle) pickWord() *Word {
	var word *Word

	for true {
		wordStr := p.Words[rand.Intn(len(p.Words))]
		word = &Word{
			Word: wordStr,
			WN:   p.WN,
		}

		if word.Init() {
			break
		}
	}

	return word
}

func (p *Puzzle) Generate() {
	rand.Seed(p.Seed)

	p.board = make([]string, 9)

	p.Word1 = p.pickWord()
	p.Word2 = p.pickWord()

	for ; p.Word1.Word == p.Word2.Word; p.Word2 = p.pickWord() {
	}

	p.placeWord(p.Word1.Word, -1, []int{})

	tries := 0

	for !p.placeWord(p.Word2.Word, -1, []int{}) {
		if tries < 9 {
			p.board = make([]string, 9)
			p.placeWord(p.Word1.Word, -1, []int{})
			tries++
		} else {
			p.Word2 = p.pickWord()

			for ; p.Word1.Word == p.Word2.Word; p.Word2 = p.pickWord() {
			}

			tries = 0
		}
	}

	for i := 0; i < 9; i++ {
		if p.board[i] == "" {
			l := rand.Intn(26) + 97
			p.board[i] = string(l)
		}
	}

	fmt.Println(p.Word1, p.Word2)
	fmt.Println(p.board)
}
