package main

import (
	"encoding/json"
	"io/ioutil"
	"net"
	"strings"
	"time"
)

func getAllowedHosts() ([]string, error) {
	ifaces, err := net.Interfaces()
	ips := []string{}

	if err != nil {
		return ips, err
	}

	for _, i := range ifaces {
		addrs, err := i.Addrs()

		if err != nil {
			return ips, err
		}

		for _, addr := range addrs {
			var ip net.IP

			switch v := addr.(type) {
			case *net.IPNet:
				ip = v.IP
			case *net.IPAddr:
				ip = v.IP
			}

			if !strings.Contains(ip.String(), ":") {
				ips = append(ips, "http://"+ip.String()+":3000")
			}
		}
	}

	ips = append(ips, "http://localhost:3000")

	return ips, nil
}

func getPossibleSteps(lastIndex int) []int {
	row := lastIndex / 4
	column := lastIndex % 4
	possibleSteps := []int{}

	// TODO: I changed the above to account for 4 rows and 4 columns. Change the
	// below to account for that as well.

    // Down
    if (row == 0 || row == 1 || row == 2) {
		possibleSteps = append(possibleSteps, lastIndex+4)
    }

	// Up.
	if row == 1 || row == 2 || row == 3 {
		possibleSteps = append(possibleSteps, lastIndex-4)
	}

	// Right.
	if column == 0 || column == 1 || column == 2 {
		possibleSteps = append(possibleSteps, lastIndex+1)
	}

	// Left.
	if column == 1 || column == 2 || column == 3 {
		possibleSteps = append(possibleSteps, lastIndex-1)
	}

	// Down and right.
	if (column == 0 || column == 1 || column == 2) && (row == 0 || row == 1 || row == 2) {
		possibleSteps = append(possibleSteps, lastIndex+5)
	}

	// Down and left.
	if (column == 1 || column == 2 || column == 3) && (row == 0 || row == 1 || row == 2) {
		possibleSteps = append(possibleSteps, lastIndex+3)
	}

	// Up and left.
	if (column == 1 || column == 2 || column == 3) && (row == 1 || row == 2 || row == 3) {
		possibleSteps = append(possibleSteps, lastIndex-5)
	}

	// Up and right.
	if (column == 0 || column == 1 || column == 2) && (row == 1 || row == 2 || row == 3) {
		possibleSteps = append(possibleSteps, lastIndex-3)
	}

	return possibleSteps
}

func readJSONFile(fileName string, obj interface{}) error {
	data, err := ioutil.ReadFile(fileName)

	if err != nil {
		return err
	}

	err = json.Unmarshal(data, obj)

	return err
}

func getDate() time.Time {
	date := time.Now()
	startOfDay := time.Date(date.Year(), date.Month(), date.Day(), 0, 0, 0, 0, date.Location())

	return startOfDay
}

func removeIndex(arr []int, index int) []int {
	if index == len(arr)-1 {
		return arr[:index]
	}

	return append(arr[:index], arr[index+1:]...)
}

func checkIfStrInArr(needle string, haystack []string) bool {
	for _, val := range haystack {
		if val == needle {
			return true
		}
	}

	return false
}

func checkIfIntInArr(needle int, haystack []int) bool {
	for _, val := range haystack {
		if val == needle {
			return true
		}
	}

	return false
}
