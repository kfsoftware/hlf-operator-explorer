package main

import (
	"embed"

	"github.com/kfsoftware/hlf-operator-ui/api/cmd"
	"github.com/kfsoftware/hlf-operator-ui/api/config"
)

//go:embed dist/*
var views embed.FS

func main() {
	configCMD := config.ConfigCMD{
		Views: views,
	}
	cmd := cmd.NewRootCMD(configCMD)
	cmd.Execute()
}
