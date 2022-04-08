package main

import (
	"strings"

	"github.com/fluhus/gostuff/nlp/wordnet"
)

type Word struct {
	Word string           `json:"w"`
	Desc string           `json:"d"`
	WN   *wordnet.WordNet `json:"-"`
}

func (w *Word) Init() bool {
	noun := w.WN.Search(w.Word)["n"]

	if len(noun) == 0 {
		return false
	}

	w.Desc = strings.ReplaceAll(noun[0].Gloss, w.Word, "XXX")

	if len(w.Desc) == 0 {
		return false
	}

	w.Desc = strings.Title(w.Desc)
	w.Desc = w.Desc[:1] + strings.ToLower(w.Desc[1:]) + "."

	return true
}
