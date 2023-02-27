package cmd

import (
	"github.com/kfsoftware/hlf-operator-ui/api/cmd/serve"
	"github.com/kfsoftware/hlf-operator-ui/api/config"
	"github.com/spf13/cobra"
)

func NewRootCMD(conf config.ConfigCMD) *cobra.Command {
	var rootCmd = &cobra.Command{
		Use:   "hlf-operator-api",
		Short: "Hugo is a very fast static site generator",
		Long: `A Fast and Flexible Static Site Generator built with
				  love by spf13 and friends in Go.
				  Complete documentation is available at http://hugo.spf13.com`,
		Run: func(cmd *cobra.Command, args []string) {
			// Do Stuff Here
		},
	}
	rootCmd.AddCommand(
		serve.NewServeCommand(conf),
	)
	return rootCmd
}
