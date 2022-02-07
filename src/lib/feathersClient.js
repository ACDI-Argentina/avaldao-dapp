import feathers from '@feathersjs/feathers';
import socketio from '@feathersjs/socketio-client';
import io from 'socket.io-client/dist/socket.io';
import auth from '@feathersjs/authentication-client';
import localforage from 'localforage';
import rx from 'feathers-reactive';
import config from '../configuration';

export const socket = io(config.feathersConnection, {
  transports: ['websocket'],
});

// socket IO error events
socket.on('connect_error', _e => console.log('Could not connect to FeatherJS'));
socket.on('connect_timeout', _e => console.log('Could not connect to FeatherJS: Timeout'));
socket.on('reconnect_attempt', _e => console.log('Trying to reconnect to FeatherJS: Timeout'));

export const feathersClient = feathers()
  .configure(socketio(socket, { timeout: 30000, pingTimeout: 30000, upgradeTimeout: 30000 }))
  .configure(auth({ storage: localforage }))
  .configure(
    rx({
      idField: '_id',
    }),
  );

feathersClient.service('uploads').timeout = 10000;