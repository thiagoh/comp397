(function() {

  'use script';

  var answer,
    guesses = 0,
    hint = '';

  //generates randomly a letter from A to Z (ASCII code from 65 to 90)
  function randomLetterAZ() {
    return String.fromCharCode(Math.floor(Math.random() * 26 + 65));
  }

  function checkGuess(guess) {
    var hint = '';
    var parsedGuess = guess.charAt(0).toUpperCase();

    guesses++;

    if (parsedGuess != answer && guesses >= 7) {
      hint = 'You lost!';
    } else if (parsedGuess == answer && guesses < 7) {
      hint = 'You Won! Great Job';
    } else if (parsedGuess == answer && guesses == 7) {
      hint = 'You Won!';
    } else if (parsedGuess.charCodeAt(0) < answer.charCodeAt(0)) {
      hint = 'Higher...';
    } else {
      hint = 'Lower...';
    }

    return hint;
  }

  $(function() {
    answer = randomLetterAZ();
    $('.hintvalue').html(answer);

    $("form a#guess").click(function() {
      var guess = $("input:first").val();
      var guessHint = checkGuess(guess);

      $('.hint').html(guessHint);
      $('.guesscount').html(guesses);

    });

  });
})();