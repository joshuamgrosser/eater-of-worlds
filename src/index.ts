// eater-of-worlds - Hello World Module
console.log("Hello World! This code runs immediately when the file is loaded.");

Hooks.on("init", function() {
  console.log("Eater of Worlds | This code runs once the Foundry VTT software begins its initialization workflow.");
});

Hooks.on("ready", function() {
  console.log("Eater of Worlds | This code runs once core initialization is ready and game data is available.");
});