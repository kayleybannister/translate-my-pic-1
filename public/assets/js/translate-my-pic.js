$(document).ready(function()
{
  // Global variables
  var relativeURL = window.location.origin;
  //var keywords = [];
  //var translatedKeywords = [];
  var sourceLanguage = "";
  var targetLanguage = "";

  var languages = [
    {
      language: "English",
      languageCode: "en"
    },
    {
      language: "Spanish",
      languageCode: "es"
    },
    {
      language: "French",
      languageCode: "fr"
    },
    {
      language: "Italian",
      languageCode: "it"
    },
    {
      language: "German",
      languageCode: "de"
    },
    {
      language: "Portuguese",
      languageCode: "pt"
    }
  ];

  // This function is used to retrieve the value in the user_id cookie set during log in
  function getCookie(cookieName)
  {
    var name = cookieName + "=";
    var decodedCookie = decodeURIComponent(document.cookie); // Retrieves cookie string from browser cookies by decoding it
    var ca = decodedCookie.split(';'); // Creates an array of all name/value pairs in the cookie string
    
    // For loop which iterates through the cookies array to find the desired cookie value
    for(var i = 0; i <ca.length; i++) {
      var c = ca[i];
      while (c.charAt(0) == ' ') {
        c = c.substring(1);
      }
      if (c.indexOf(name) == 0) {
        return c.substring(name.length, c.length);
      }
    }
    return "";
  }

  // This function retrieves all of the previous translations for a logged in user
  function getTranslationHistory(user)
  { 
    if(getCookie("user_id") != "")
    {
      $.ajax(
      {
        method: "GET",
        url: relativeURL + "/translations",
        data:
        {
          "user_id": user
        }
      }).done(function(data)
      {
        console.log(data);

        for(i = 0; i < data.length; i++)
        {
          console.log("Translation ID: " + data[i].id);
          console.log("Translated Language: " + data[i].translated_language);
          console.log("Analyzed Keywords: " + data[i].analyzed_keywords);
          console.log("Translated Keywords: " + data[i].translated_keywords + "\n");

          var transColDiv = $("<section>");
          transColDiv.attr(
          {
            "class": "col-md-12",
            "style": "margin-top: 12px;"
          });

          var transCardDiv = $("<div>");
          transCardDiv.attr("class", "card translation");

          var transCardBodyDiv = $("<div>");
          transCardBodyDiv.attr("class", "card-body");

          var transCardTitleHeader = $("<h5>");
          transCardTitleHeader.attr("class", "card-title mt-1");
          transCardTitleHeader.text("Translation #: " + (i+1));

          var transCardTextDiv = $("<div>");
          transCardTextDiv.attr("class", "card-text");

          var transCardDetailRow = $("<div>");
          transCardDetailRow.attr("class", "row");

          // Translation Language Column
          var transLangCol = $("<div>");
          transLangCol.attr("class", "col-md-3 text-left");

          var transLangHeader = $("<p>");
          transLangHeader.text("Translated Language:");

          var transLangDiv = $("<div>");
          transLangDiv.text(data[i].translated_language);

          transLangCol.append(transLangHeader);
          transLangCol.append(transLangDiv);

          // Translation Keywords Column
          var analyzedKeywordsCol = $("<div>");
          analyzedKeywordsCol.attr("class", "col-md-3 text-left");

          var analyzedKeywordsHeader = $("<p>");
          analyzedKeywordsHeader.text("Analyzed Keywords:");

          var analyzedKeywordsDiv = $("<div>");
          analyzedKeywordsDiv.text(data[i].analyzed_keywords);

          analyzedKeywordsCol.append(analyzedKeywordsHeader);
          analyzedKeywordsCol.append(analyzedKeywordsDiv);

          // Translated Keywords Column
          var transKeywordsCol = $("<div>");
          transKeywordsCol.attr("class", "col-md-3 text-left");

          var transKeywordsHeader = $("<p>");
          transKeywordsHeader.text("Translated Keywords:");

          var transKeywordsDiv = $("<div>");
          transKeywordsDiv.text(data[i].translated_keywords);

          transKeywordsCol.append(transKeywordsHeader);
          transKeywordsCol.append(transKeywordsDiv);

          // Speech/Text Buttons Column
          var buttonsCol = $("<div>");
          buttonsCol.attr("class", "col-md-3 text-center");

          var buttonsHeader = $("<p>");
          buttonsHeader.text("Speech/Delete?");

          var buttonsDiv = $("<div>");
          buttonsDiv.attr(
          {
            "class": "buttons-div",
            "id": "buttons-" + data[i].id
          });
          
          var speechButton = $("<button>");
          speechButton.attr(
          {
            "type": "submit",
            "class": "btn btn-primary speech-btn",
            "value": "speech",
            "id": data[i].id
          });
          speechButton.text("Say It");

          var deleteButton = $("<button>");
          deleteButton.attr(
          {
            "type": "submit",
            "class": "btn btn-primary del-btn",
            "value": "delete",
            "id": data[i].id
          });
          deleteButton.text("Delete Translation");
          
          var buttonSpan = $("<span>");
          buttonSpan.text("   ");
        
          buttonsDiv.append(speechButton);
          buttonsDiv.append(buttonSpan);
          buttonsDiv.append(deleteButton);

          buttonsCol.append(buttonsHeader);
          buttonsCol.append(buttonsDiv);

          // Build Translation History Rows
          transCardDetailRow.append(transLangCol);
          transCardDetailRow.append(analyzedKeywordsCol);
          transCardDetailRow.append(transKeywordsCol);
          transCardDetailRow.append(buttonsCol);

          // Build Translation History Cards
          transCardTextDiv.append(transCardDetailRow);
          transCardTitleHeader.append(transCardTextDiv);
          transCardBodyDiv.append(transCardTitleHeader);
          transCardDiv.append(transCardBodyDiv);
          transColDiv.append(transCardDiv);

          // Insert Translation History Cards
          $("#translation-history-container").append(transColDiv);
        }
      });
    }

    // Hides the translation history container if the user is not logged (or anonymous)
    else
    {
      $("#translation-history-container").hide();
    }
  }

  // Function to add recent translation to translation history
  function addTranslation(user, language, keywords, translatedKeywords)
  {

    $.ajax(
    {
      method: "POST",
      url: relativeURL + "/translations",
      data:
      {
        "user_id": user,
        "translated_language": language,
        "analyzed_keywords": keywords.join(", "),
        "translated_keywords": translatedKeywords.join(", "),
      }
    }).done(function(data)
    {
      console.log("Translation added to translation history!");
      
      $("#translation-history-container").empty();

      getTranslationHistory(getCookie("user_id"));
    });
  }

  // Function to delete translations from a user's translation history
  function deleteTranslation(user, translation)
  {
    $.ajax(
    {
      method: "PUT",
      url: relativeURL + "/translations",
      data:
      {
        translation_id: translation,
        user_id: user
      }
    }).done(function(data)
    {
      console.log("Translation has been deleted.");
    });
  }

  // Function to detect labels or keywords in uploaded image (AWS Rekognition API)
  function DetectLabels(imageData) {

      // Sets the AWS for authentication
      AWS.region = "us-east-2";

      // Creates the AWS Rekognition object which will be used to analyze the image
      var rekognition = new AWS.Rekognition();

      // Creates the parameters for invoking the Rekognition API and sets them to a variable in the form of an object
      var rekognitionParams = 
      {
        Image: {
          // This is the image after it has been transformed into bytes which can be analyzed by AWS Rekognition
          Bytes: imageData
        },
        MaxLabels: 5,
      };

      // Thie invokes the AWS Rekognition detectLabels Action using the rekognition object we created above
      rekognition.detectLabels(rekognitionParams, function (err, data) {
          // Conditional which checks to see if an error is returned; if an error is returned, the error is logged in the console
          if (err) console.log(err, err.stack); // an error occurred
        
          else
          {
          
              keywords = [];

                // For loop that iterates for each label/keyword that is returned in the AWS Rekognition API response
              for (var i = 0; i < data.Labels.length; i++)
              {
                  
                  var text = data.Labels[i].Name;

                  keywords.push(text);

              }

              translateWords(keywords.toString());
          }
      });
  }

  //TESTING OUT ADDING IN OTHER LANGUAGES
  function translateWords(text) {
      AnonLog();

      var translate = new AWS.Translate({region: AWS.config.region});
      var targetDropdown = document.getElementById("targetLanguageCodeDropdown");
      var targetDropDownText = targetDropdown.options[targetDropdown.selectedIndex].text;
      
      console.log("Dropdown Picker: " + targetDropdown);
      var targetLanguageCode = "";

      for (i = 0; i < languages.length; i++)
      { 
        if (languages[i].language == targetDropDownText)
        {
          targetLanguageCode = languages[i].languageCode;
          console.log("Target Language Code: " + targetLanguageCode);
        }      
      }

      var translateParams = {
          Text: text,
          SourceLanguageCode: "en",
          TargetLanguageCode: targetLanguageCode
      };

      translate.translateText(translateParams, function(err, data) {
          if (err) {
              console.log(err, err.stack);

          }
          if (data) {
              translatedKeywords = data.TranslatedText.split(", ");
              
              console.log("Source Language Code: " + data.SourceLanguageCode);
              console.log("Target Language Code: " + data.TargetLanguageCode);
              console.log("Keywords Array: " + keywords);
              console.log(keywords);
              console.log("Translated Keywords Array: " + translatedKeywords);
              console.log(translatedKeywords);

              // Creates jQuery DOM elements for Keywords and Translations
              var keywordsDiv = $("<div>");
              var translationDiv = $("<div>");
              var keywordsP = $("<p>");
              var translationP = $("<p>");

              // Resets the Keywords container in DOM and then retrieves the keywords returned from AWS Rekognition
              $("#keywords").empty();
              for (i = 0; i < keywords.length; i++)
              {
                $(keywordsP).append(keywords[i]);
                $(keywordsDiv).append(keywordsP);
                keywordsP = $("<p>");
              }

              // Resets the Translations container in DOM and then retrieves the translated keywords returned from AWS Translate
              $("#translation").empty();
              for (i = 0; i < translatedKeywords.length; i++)
              {
                $(translationP).append(translatedKeywords[i]);
                $(translationDiv).append(translationP);
                translationP = $("<p>");
              }

              // Updates the DOM with new containers for Keywords and Translations
              $("#keywords").html(keywordsDiv);
              $("#translation").html(translationDiv);

              // Checks to see if a cookie has been sent for user_id
              // If no cookie is set, then the user_id is set to anonymous for the translation in the database
              if (getCookie("user_id") == "")
              {
                addTranslation("Anonymous", targetDropDownText, keywords, translatedKeywords);
              }
              
              // If a cookie is set, then the user_id us set to that cookie value for the translation in the database 
              else
              {
                addTranslation(getCookie("user_id"), targetDropDownText, keywords, translatedKeywords);
              }
          }
          });
  }

  // Function to convert image to a file/bytes that can be processed by AWS Rekognition API
  function ProcessImage()
  {
    // Invokes function to authenticate securely to AWS so that the AWS APIs can be invoked
    AnonLog();

    // Creating an object to store the HTML element which the image resides
    var control = document.getElementById("fileToUpload");
    console.log(control);
    
    // Creating an object to store the actual image
    var file = control.files[0];
    console.log(file);

    // Load base64 encoded image 
    // FileRead is a vanilla JavaScript method to read/manage files include images
    var reader = new FileReader();

    // Reads the file when it is loaded/selected by the user in the DOM
    reader.onload = (function (theFile)
    {
      return function (e) {
        var img = document.createElement('img');
        var image = null;
        // Points the FileReader function to the image where is stored
        img.src = e.target.result;
        var jpg = true;
        
        //Loads the image if image base64 encoded
        try 
        {
          image = atob(e.target.result.split("data:image/jpeg;base64,")[1]);
        
        // Catching an error if the image is a not a JPG file and setting a jpg variavle to be read later
        } catch (e) 
        {
          jpg = false;
        }

        // Tries to read image again and then returns an error indicating that the image is not in the correct format
        if (jpg == false) 
        {
          try {
            image = atob(e.target.result.split("data:image/png;base64,")[1]);
          } catch (e) {
            console.log("Not an image file Rekognition can process");
            return;
          }
        }

        // Unencode image bytes for AWS Rekognition DetectLabels API 
        var length = image.length;

        // Vanilla JavaScript method for storing files and other type arrays
        imageBytes = new ArrayBuffer(length);

        // Turns it into an array of integer values
        var ua = new Uint8Array(imageBytes);
        for (var i = 0; i < length; i++) {
          ua[i] = image.charCodeAt(i);
        }

        //Call Rekognition  
        DetectLabels(imageBytes);
      };
    })(file);
    reader.readAsDataURL(file);
  }

  function AnonLog()
  {
    // Configure the credentials provider to use your identity pool
    AWS.config.region = 'us-east-2'; // Region
    AWS.config.credentials = new AWS.CognitoIdentityCredentials({
      IdentityPoolId: 'us-east-2:7359eb59-58a3-4653-98f7-8e4d06680409',
    });
    
    // Make the call to obtain credentials
    AWS.config.credentials.get(function () {
      // Credentials will be available when this function is called.
      var accessKeyId = AWS.config.credentials.accessKeyId;
      var secretAccessKey = AWS.config.credentials.secretAccessKey;
      var sessionToken = AWS.config.credentials.sessionToken;
    });
  }

  function speakTranslation(user, translation)
  {
    console.log(translation);

    $.ajax(
      {
        method: "GET",
        url: relativeURL + "/translation",
        data:
        {
          "user_id": user,
          "id": translation
        }
      }).done(function(data)
      {
        // Invokes function to authenticate securely to AWS so that the AWS APIs can be invoked
        AnonLog();

        console.log("T - Words: " + JSON.stringify(data));

        function speakText()
        {
          // Create the JSON parameters for getSynthesizeSpeechUrl
          var speechParams = {
              OutputFormat: "mp3",
              SampleRate: "16000",
              Text: "",
              TextType: "text",
              VoiceId: "Matthew"
          };

          speechParams.Text = data[0].translated_keywords;

          // Create the Polly service object and presigner object
          var polly = new AWS.Polly({apiVersion: '2016-06-10'});
          var signer = new AWS.Polly.Presigner(speechParams, polly)

          // Create presigned URL of synthesized speech file
          signer.getSynthesizeSpeechUrl(speechParams, function(error, url)
          {
            if (error)
            {
              var speechDiv = $("<div>");
              speechDiv.attr("style", "margin-top: 12px;");

              speechDiv.text(error);

              var speechButtonDiv = "#buttons-" + translation;
              $(speechButtonDiv).append(speechDiv);

            } else
            {

                var speechButtonDiv = "#buttons-" + translation;
                var audioSourceId = "audioSource-" + translation;
                var audioPlaybackId = "audioPlayback-" + translation;

                var speechDiv = $("<div>");
                speechDiv.attr("style", "margin-top: 12px;");

                var speechControls = $("<audio controls>");
                speechControls.attr("id", audioPlaybackId);

                var speechSource = $("<source>");
                speechSource.attr(
                {
                  "id": audioSourceId,
                  "type": "audio/mp3",
                  "src": ""
                });

                speechControls.append(speechSource);
                speechDiv.append(speechControls);
                $(speechButtonDiv).append(speechDiv);

                document.getElementById(audioSourceId).src = url;
                document.getElementById(audioPlaybackId).load();

            }
          });
        }

        speakText();
      });
  };

//js for dropdown function.... building from scratch, not using bootstrap
  function myFunction() {
    document.getElementById("myDropdown").classList.toggle("show");
   }
   
   window.onclick = function(event) {
    if (!event.target.matches(".dropbtn")) {
      var dropdowns = document.getElementsByClassName("dropdown-content");
      var i;
      for (i = 0; i < dropdowns.length; i++) {
        var openDropdown = dropdowns[i];
        if (openDropdown.classList.contains("show")) {
          openDropdown.classList.remove("show");
        }
      }
    }
   }

   //testing image upload
   function readURL(input) {
    if (input.files && input.files[0]) {
        var reader = new FileReader();

        reader.onload = function (e) {
            $('#imageUploaded').attr('src', e.target.result);
        }

        reader.readAsDataURL(input.files[0]);
    };
    };



  // jQuery listener on the the image uploader button; invokes the ProcessImage() function when an image path is provided
  $(document).on('change','#fileToUpload' , function()
  { 
      ProcessImage();
  });

  $("#fileToUpload").change(function()
  {
    readURL(this);
  });
 
  // Invocation of getTranslationHistory function when page loads
  getTranslationHistory(getCookie("user_id"));

  // jQuery listener to delete translation in translation history 
  $("#translation-history-container").on("click", ".speech-btn", function()
  { 
    event.preventDefault();

    console.log("Speech!");
    /*
    var speechControls = $("<audio id='audioPlayback' controls>");
    
    speechDiv.append(speechControls);
    $(".buttons-div").append(speechDiv);
    */
    speakTranslation(getCookie("user_id"), parseInt($(this).attr("id")));

  });

  // jQuery listener to delete translation in translation history 
  $("#translation-history-container").on("click", ".del-btn", function()
  { 
    event.preventDefault();
    
    // Deletes the translation associated with the delete button clicked
    deleteTranslation(getCookie("user_id"), parseInt($(this).attr("id")));

    // Clears translation history container so that it can be refreshed after deletion
    $("#translation-history-container").empty();

    // Refreshes translation history container after deletion
    getTranslationHistory(getCookie("user_id"));
  });
});
