$('button').on('click', function(){
    queryURL= "https://api.giphy.com/v1/gifs/" + favorites[faveCount] + "?api_key=" + apiKey;
    $.ajax({
      url: queryURL,
      method: "GET"
    }).then(function(response) {
      picture=response.data.images.fixed_height_still.url;
      animation=response.data.images.fixed_height.url;
        var $card = $('<div class=card>');
        var movingPicture = $("<img>");
          movingPicture.attr("src", picture);
          movingPicture.attr("alt", response.data.title);
          movingPicture.attr("animation", animation);
          movingPicture.attr("still", picture);
          movingPicture.attr("state", "still");
          $card.append(movingPicture);
          $card.append('<div class="title cardText"> Title: ' + response.data.title + '<div>');
          $card.append('<div class="rating cardText"> Rated: ' + response.data.rating.toUpperCase() + '</div>');
          $card.attr('id', response.data.id);
          $('#favorites').append($card);
    });
})