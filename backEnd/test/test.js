import http from 'k6/http';
import { sleep } from 'k6';

export let options = {
  vus: 5,          // number of virtual users
  duration: '10s',  // total test time
};

export default function () {
  http.get('http://iiitb.ac.in/');
  sleep(1);  // wait 1s between requests
}
