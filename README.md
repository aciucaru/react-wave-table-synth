# Simple wavetable synthesizer made with Web Audio API and React
Dependencies:
- [Typescript](https://www.typescriptlang.org/)
- [React](https://react.dev/)
- [tslog](https://www.npmjs.com/package/tslog) - logging library for TypeScript and JavaScript
- [Web Audio API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API) - browser built-in audio system

[Project hosted on Netlify](https://react-wave-table-synth.netlify.app/)

![screenshot](screenshots/main-app.jpg)

# How it works
This synthesizer allows creating a wavetable by specifying 2 waveforms: the **start** and **end waveforms**.
Then, all the other waveforms ar created by interpolating between those 2 waveforms. The wavetable has 8 waveforms in total.
Everything is interpolated: the frequency, the amplitude and the shape.
![screenshot](screenshots/main-waveforms.jpg)