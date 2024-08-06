export const GetArtists = (artists) => {
    let Resultartists = ''
    artists.forEach(artist => {
        if (Resultartists.length > 0) {
            Resultartists += ', ';
        }
        Resultartists += `${artist.name}`
    })
    return Resultartists
}