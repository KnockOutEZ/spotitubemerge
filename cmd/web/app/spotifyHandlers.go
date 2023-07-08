package app

import (
	"encoding/json"
	"fmt"
	"net/http"

	"github.com/labstack/echo/v4"
	spotify "github.com/zmb3/spotify/v2"
	"golang.org/x/oauth2"
)



func (app *Application) loginSpotify(c echo.Context) error {
	authURL := app.Spotify.Authenticator.AuthURL(app.Spotify.State)
	fmt.Println("Auth URL: ", authURL)
	return c.JSON(http.StatusOK, echo.Map{
		"authUrl": authURL,
	})
}


type SpotifyCode struct {
	Code string `json:"code"`
}

func (app *Application) callbackSpotify(c echo.Context) error {
	spotifyCode := SpotifyCode{}
	if err := c.Bind(&spotifyCode); err != nil {
		app.ErrorLog.Printf("Failed to bind code: %v", err)
	}
	fmt.Println("Code: ", spotifyCode.Code)

	// state := app.Spotify.State
	tok, err := app.Spotify.Authenticator.Exchange(c.Request().Context(), spotifyCode.Code)
	if err != nil {
		app.ErrorLog.Print(err)
	}
	fmt.Println("Token: ", tok)

	// if st := c.FormValue("state"); st != state {
	// 	app.ErrorLog.Printf("State mismatch: %s != %s\n", st, state)
	// }

	client := spotify.New(app.Spotify.Authenticator.Client(c.Request().Context(), tok))
	fmt.Println("Client: ", client)
	app.Spotify.Client = client

	user, err := app.Spotify.Client.CurrentUser(c.Request().Context())
	if err != nil {
		app.ErrorLog.Print(err)
	}
	app.Spotify.UserId = user.ID
	fmt.Println("You are logged in as:", user.ID)
	return c.JSON(http.StatusOK, echo.Map{
		"token": tok,
	})
}

func (app *Application) getSpotifyPlaylist(c echo.Context) error {
	var authHeaderType *oauth2.Token
	authHeader := c.Request().Header.Get("Authorization")
	json.Unmarshal([]byte(authHeader), &authHeaderType)
	client := spotify.New(app.Spotify.Authenticator.Client(c.Request().Context(), authHeaderType))

	user, err := client.CurrentUser(c.Request().Context())
	if err != nil {
		app.ErrorLog.Print(err)
	}

	playlists, err := client.GetPlaylistsForUser(c.Request().Context(), user.ID)
	if err != nil {
		app.ErrorLog.Print(err)
	}
	fmt.Println("Playlists:", playlists)
	for _, playlist := range playlists.Playlists {
		fmt.Println("  ", playlist.Name)
	}

	return c.JSON(http.StatusOK, echo.Map{
		"playlists": playlists,
	})
}

func (app *Application) getSpotifyItems(c echo.Context) error {
	var authHeaderType *oauth2.Token
	authHeader := c.Request().Header.Get("Authorization")
	json.Unmarshal([]byte(authHeader), &authHeaderType)
	strings := c.QueryParam("strings")
	fmt.Println("strings: ", strings)

	if strings == "" {
		return c.JSON(http.StatusBadRequest, echo.Map{
			"error": "strings is empty",
		})
	}
	
	client := spotify.New(app.Spotify.Authenticator.Client(c.Request().Context(), authHeaderType))

	// user, err := client.CurrentUser(c.Request().Context())
	// if err != nil {
	// 	app.ErrorLog.Print(err)
	// }

	playlist, err := client.GetPlaylistItems(c.Request().Context(), spotify.ID(strings))
	if err != nil {
		app.ErrorLog.Print(err)
	}
	for _, playlist := range playlist.Items {
		fmt.Println("  ", playlist.Track)
	}

	return c.JSON(http.StatusOK, echo.Map{
		"items": playlist,
	})
}


func (app *Application) searchSpotifyItems(c echo.Context) error {
	var authHeaderType *oauth2.Token
	authHeader := c.Request().Header.Get("Authorization")
	json.Unmarshal([]byte(authHeader), &authHeaderType)

	strings := c.QueryParam("strings")
	fmt.Println("strings: ", strings)

	// searching tracks with given name
	client := spotify.New(app.Spotify.Authenticator.Client(c.Request().Context(), authHeaderType))
	results, err := client.Search(c.Request().Context(), strings, spotify.SearchTypeTrack) //spotify.SearchTypePlaylist|spotify.SearchTypeAlbum
	if err != nil {
		fmt.Println(err)
	}
	fmt.Println("results:", results)

	// handle songs results
	if results.Tracks != nil {
		return c.JSON(http.StatusOK, echo.Map{
			"items": results.Tracks.Tracks,
		})
	}

	return c.JSON(http.StatusOK, echo.Map{
		"items": []string{},
	})
}