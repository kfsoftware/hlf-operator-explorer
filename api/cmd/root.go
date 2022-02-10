package cmd

import (
	"fmt"
	"github.com/kfsoftware/hlf-operator-ui/api/cmd/serve"
	"os"

	"github.com/spf13/cobra"
)

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

func Execute() {
	rootCmd.AddCommand(
		serve.NewServeCommand(),
	)
	if err := rootCmd.Execute(); err != nil {
		fmt.Println(err)
		os.Exit(1)
	}
}
