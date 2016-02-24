(function doInitial() {
  var bodyText = $("body").text(),
    common = [],
    fluff = ["are", "is", "where", "was"];
  var cleanStr = bodyText.replace(/[^\w\s]/gi, "").replace(/\(.*;?\;/g, "").replace(/\w{20}/ig, "").replace(/[0-9]/g, "").replace(/\s\s+/g, ' ').replace(/(\b(\w{1,1})\b(\W|$))/g, "");
  //fetching the most common words in english
  $.get("https://en.wikipedia.org/wiki/Most_common_words_in_English", function(data) {
    var response = $('<html />').html(data);
    var table = response.find('table.wikitable');
    var list = table.find('tr td:nth-child(2)');
    list.each(function(i, item) {
      common.push($(item).text());
    })
    common = fluff.concat(common);
    var words = cleanStr.toLowerCase().split(/\s/); //splitting on whitespace rather than space
    buildResults(words, common);
  });
})();

function buildResults(words, common) {
  var map = {},
    topResults = [];
  //creating a key value pairs of the words with their frequency
  for (var i = 0; i < words.length; i++) {
    if (map[words[i]]) {
      map[words[i]]++;
    } else {
      map[words[i]] = 1;
    }
  }
  //remove commmon words
  for (var j = 0; j < common.length; j++) {
    if (map[common[j]]) {
      delete map[common[j]];
    }
  }
  //sorting frequencies in decreasing order
  var frequencies = Object.keys(map);
  frequencies.sort(function(a, b) {
    return map[b] - map[a];
  });
  for (var k = 0; k < 24; k++) {
    topResults.push(frequencies[k]);
  }
  //pass results to render DOM function
  renderDOM(topResults, map);
}

function renderDOM(words, map) {
  var DOM = $('body').html();
  var joinedWords = words.join("|");
  //function to escape regex variables
  function escapeRegex(value) {
    return value.replace(/[\-\[\]{}()*+?.,\\\^$|#\s]/g, "\\$&");
  }
  for (var i = 0; i < words.length; i++) {
    DOM = DOM.replace(new RegExp(escapeRegex(words[i]), "ig"), map[words[i]]);
  }

  // render a new DOM 
  $('body').html(DOM);
}
