package main

import (
	"fmt"
	"math/rand"

	"github.com/fluhus/gostuff/nlp/wordnet"
	"github.com/samber/lo"
)

type Puzzle struct {
	Words      []string
	Seed       int64
	board      []string
	WN         *wordnet.WordNet
	Word1      *Word
	Word2      *Word
	BoardWords []*Word
}

func (p *Puzzle) getEmptyIndexes(letters ...string) ([]int, []bool) {
	indexes := make([]int, 0)
	isExisting := make([]bool, 0)
	fmt.Println(letters, p.board)

	for i, l := range p.board {
		if l == "" {
			indexes = append(indexes, i)
			isExisting = append(isExisting, false)
		} else if len(letters) > 0 && l == letters[0] {
			indexes = append(indexes, i)
			isExisting = append(isExisting, true)
		}
	}

	return indexes, isExisting
}

func (p *Puzzle) placeWord(word string, lastPos int, positions []int) bool {
	if len(word) == 0 {
		return true
	}
	fmt.Println(word, p.board)

	if lastPos < 0 {
		pos := -1
		possibleIdxs, isExisting := p.getEmptyIndexes(word[:1])

		for tempPos := -1; len(possibleIdxs) > 0; tempPos = possibleIdxs[rand.Intn(len(possibleIdxs))] {
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

		// TODO: This might be reversing an index that another word depends on.
		if !p.placeWord(word[1:], pos, append(positions, pos)) {
			if !isExisting[0] {
				p.board[pos] = ""
			}

			return false
		}
		
		fmt.Println(word, "Initial pos:", pos)
	} else {
		possibleSteps := getPossibleSteps(lastPos)
		fmt.Println("Possible steps:", possibleSteps)

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

func (p *Puzzle) GenerateNew() []*Word {
	rand.Seed(p.Seed)
	
	p.board = make([]string, 16)
	words := make([]*Word, 0)
	wordsLen := 0
	
	for ; wordsLen < 30; {
		word := p.pickWord()
		_, idx, _ := lo.FindIndexOf(words, func(w *Word) bool {
			return w.Word == word.Word
		})

		if idx >= 0 {
			continue
		}

		if !p.placeWord(word.Word, -1, []int{}) {
			continue
		}

		words = append(words, word)
		wordsLen++
	}

	for i := 0; i < 16; i++ {
		if p.board[i] == "" {
			l := rand.Intn(26) + 97
			p.board[i] = string(l)
		}
	}

	p.BoardWords = words
	return words
}

func (p *Puzzle) Generate() {
	rand.Seed(p.Seed)

	p.board = make([]string, 16)

	p.Word1 = p.pickWord()
	p.Word2 = p.pickWord()

	for ; p.Word1.Word == p.Word2.Word; p.Word2 = p.pickWord() {
	}

	p.placeWord(p.Word1.Word, -1, []int{})

	tries := 0

	for !p.placeWord(p.Word2.Word, -1, []int{}) {
		if tries < 16 {
			p.board = make([]string, 16)
			p.placeWord(p.Word1.Word, -1, []int{})
			tries++
		} else {
			p.Word2 = p.pickWord()

			for ; p.Word1.Word == p.Word2.Word; p.Word2 = p.pickWord() {
			}

			tries = 0
		}
	}

	for i := 0; i < 16; i++ {
		if p.board[i] == "" {
			l := rand.Intn(26) + 97
			p.board[i] = string(l)
		}
	}

	fmt.Println(p.Word1, p.Word2)
	fmt.Println(p.board)
}
