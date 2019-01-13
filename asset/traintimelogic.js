// 1. Initialize Firebase
let config = {
  apiKey: "AIzaSyAyPVPpOvLDVUpGoBzcZyKnW_7ZhkiTJTc",
  authDomain: "trainactvity.firebaseapp.com",
  databaseURL: "https://trainactvity.firebaseio.com/",
  storageBucket: "gs://trainactvity.appspot.com/"
};

firebase.initializeApp(config);
let database = firebase.database();

// 2. Button for adding Employees
$("#add-trainSchedule-btn").on("click", function (event) {
  event.preventDefault();

  // Grabs user input
  let trainName = $("#trainName-input").val().trim();
  let destination = $("#destination-input").val().trim();
  let firstTrainTime = moment($("#firstTrainTime-input").val().trim(), "HH:mm").format("HH:mm");
  let frequency = $("#frequency-input").val().trim();

  // Creates local "temporary" object for holding employee data
  let newTrainInfo = {
    name: trainName,
    place: destination,
    firstTrain: firstTrainTime,
    freq: frequency
  };

  // Uploads employee data to the database
  database.ref().push(newTrainInfo);

  // Clears all of the text-boxes
  $("#trainName-input").val("");
  $("#destination-input").val("");
  $("#firstTrainTime-input").val("");
  $("#frequency-input").val("");
});

// 3. Create Firebase event for adding employee to the database and a row in the html when a user adds an entry
database.ref().on("child_added", function (childSnapshot) {
  console.log(childSnapshot.val());

  // Store everything into a let table.
  let trainName = childSnapshot.val().name;
  let destination = childSnapshot.val().place;
  let firstTrainTime = childSnapshot.val().firstTrain;
  let frequency = childSnapshot.val().freq;

  // First Time (pushed back 1 year to make sure it comes before current time)
  let firstTimeConverted = moment(firstTrainTime, "HH:mm").subtract(1, "years");
  console.log(firstTimeConverted);

  // Current Time
  let currentTime = moment();
  console.log("CURRENT TIME: " + moment(currentTime).format("hh:mm"));

  // Difference between the times
  let diffTime = moment().diff(moment(firstTimeConverted), "minutes");
  console.log("DIFFERENCE IN TIME: " + diffTime);

  // Time apart (remainder)
  let tRemainder = diffTime % frequency;
  console.log(tRemainder);

  // Minute Until Train
  let tMinutesTillTrain = frequency - tRemainder;
  console.log("MINUTES TILL TRAIN: " + tMinutesTillTrain);

  // Next Train
  let nextTrain = moment().add(tMinutesTillTrain, "minutes");
  console.log("ARRIVAL TIME: " + moment(nextTrain).format("hh:mm"));

  // Create the new row
  let updateTrainSchedule = $("<tr>").append(
    $("<td>").text(trainName),
    $("<td>").text(destination),
    $("<td>").text(frequency),
    $("<td>").text(nextTrain),
    $("<td>").text(tMinutesTillTrain),
  );

  // Append the new row to the table
  $("#train-table > tbody").append(updateTrainSchedule);
});





