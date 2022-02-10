package serve

import "github.com/spf13/cobra"

type serveConfig struct {
	address        string
	metricsAddress string
	config         string
}

func NewServeCommand() *cobra.Command {
	s := &serveConfig{}
	cmd := &cobra.Command{
		Use:   "serve",
		Short: "serve",
		Long:  "serve",
		RunE: func(cmd *cobra.Command, args []string) error {
			return cmd.Help()
		},
	}
	f := cmd.Flags()
	f.StringVar(&s.address, "address", "", "address for the server")
	return cmd
}
