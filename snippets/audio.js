var context;
var bufferLoader;
window.AudioContext = window.AudioContext || window.webkitAudioContext;
context = new AudioContext();

function finishedLoading(bufferList) {
  Create two sources and play them both together.
  var source1 = context.createBufferSource();
  source1.buffer = bufferList[0];

  source1.connect(context.destination);
  source1.start(0);
  sounds = bufferList;
}

bufferLoader = new BufferLoader(
context,
[
  'begins.wav',
  'followsOn.wav',
  'theEnd.wav',
],
finishedLoading
);

bufferLoader.load();

console.log(sounds);