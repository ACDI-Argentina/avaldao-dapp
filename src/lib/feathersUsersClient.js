import feathers from '@feathersjs/feathers';
import socketio from '@feathersjs/socketio-client';
import auth from '@feathersjs/authentication-client';
import localforage from 'localforage';
import io from 'socket.io-client';
import config from '../configuration';
import { feathersClient } from './feathersClient';

const socket = io(config.feathersUsersConnection);

socket.on('connect_error', _e => console.log('Could not connect to FeatherJS'));
socket.on('connect_timeout', _e => console.log('Could not connect to FeatherJS: Timeout'));
socket.on('reconnect_attempt', _e => console.log('Trying to reconnect to FeatherJS: Timeout'));

const feathersSocketOptions = { timeout: 10000 };

const client = feathers();
client.configure(socketio(socket, feathersSocketOptions));
client.configure(auth({ storage: localforage }));

client.on('authenticated', async auth => {
    console.log(`feathers users clients authenticated!`)
    try{
        console.log(auth);
        await feathersClient.authenticate(auth);
    } catch(err){
        console.log(err);
    }
}); 

export const feathersUsersClient = client; 
window.feathersUsersClient = feathersUsersClient;