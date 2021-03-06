const alarmStates = [

];

let subscriptionTimers = {};

const intervalTimeInMs = 50;

const activeSubscriptions = [
  {
    path: [ "PANDA:SEQ1", "outa" ],
    index: 0,
    interval: intervalTimeInMs,
    update: (response, index) => {
      response.changes[0][1].value = index%2 === 0;
      const now = (new Date());
      response.changes[0][1].timeStamp.nanoseconds = now.getMilliseconds()*1000000;
      response.changes[0][1].timeStamp.secondsPastEpoch = Math.floor(now.getTime()/1000);
      return response;
    }
  },
  {
    path: [ "PANDA:SEQ1", "outb" ],
    index: 0,
    interval: intervalTimeInMs,
    update: (response, index) => {
      response.changes[0][1].value = index%2 === 0;
      const now = (new Date());
      response.changes[0][1].timeStamp.nanoseconds = now.getMilliseconds()*1000000;
      response.changes[0][1].timeStamp.secondsPastEpoch = Math.floor(now.getTime()/1000);
      return response;
    }
  },
  {
    path: [ "PANDA:SEQ1", "repeats" ],
    index: 0,
    interval: intervalTimeInMs,
    update: (response, index) => {
      response.changes[0][1].value = index%2 === 0;
      const now = (new Date());
      response.changes[0][1].timeStamp.nanoseconds = now.getMilliseconds()*1000000;
      response.changes[0][1].timeStamp.secondsPastEpoch = Math.floor(now.getTime()/1000);
      return response;
    },
  },
  {
    path: [ "PANDA:INENC1", "val" ],
    index: 0,
    interval: 50,
    update: (response, index) => {
      const val = 180*((index%500)-1);
      response.changes[0][1].value = val;
      const now = (new Date());
      response.changes[0][1].timeStamp.nanoseconds = now.getMilliseconds()*1000000;
      response.changes[0][1].timeStamp.secondsPastEpoch = Math.floor(now.getTime()/1000);
      return response;
    },
  },
  {
    path: [ "PANDA:INENC1", "valScaled" ],
    index: 0,
    interval: 50,
    update: (response, index) => {
      const val = 180*(((index%500)/250)-1);
      response.changes[0][1].value = val;
      if (val > -120 && val < 120) {
        response.changes[0][1].alarm.severity = 0;
      } else if ((val > 120 && val < 160) || (val > -160 && val < -120)) {
        response.changes[0][1].alarm.severity = 1;
      } else {
        response.changes[0][1].alarm.severity = 2;
      }
      const now = (new Date());
      response.changes[0][1].timeStamp.nanoseconds = now.getMilliseconds()*1000000;
      response.changes[0][1].timeStamp.secondsPastEpoch = Math.floor(now.getTime()/1000);
      return response;
    },
  },
  {
    path: [ "PANDA:INENC1", "a" ],
    index: 0,
    interval: 50,
    update: (response, index) => {
      response.changes[0][1].value = (index%4 < 2);
      const now = (new Date());
      response.changes[0][1].timeStamp.nanoseconds = now.getMilliseconds()*1000000;
      response.changes[0][1].timeStamp.secondsPastEpoch = Math.floor(now.getTime()/1000);
      return response;
    },
  },
  {
    path: [ "PANDA:INENC1", "b" ],
    index: 0,
    interval: 50,
    update: (response, index) => {
      response.changes[0][1].value = ((index+1)%4 < 2);
      const now = (new Date());
      response.changes[0][1].timeStamp.nanoseconds = now.getMilliseconds()*1000000;
      response.changes[0][1].timeStamp.secondsPastEpoch = Math.floor(now.getTime()/1000);
      return response;
    },
  },
];

function pathsMatch(a, b) {
  return a.length === b.length && a.every((a, i) => a === b[i]);
}

function sendResponse(socket, message) {
  if (socket.readyState === socket.OPEN) {
    socket.send(JSON.stringify(message));
  }
}

function checkForActiveSubscription(request, response, socket) {
  const matchingUpdate = activeSubscriptions.findIndex(s => pathsMatch(s.path, request.path));

  if (matchingUpdate > -1) {
    const subscription = activeSubscriptions[matchingUpdate];
    const timer = setInterval(() => {
      subscription.index += 1;
      const updatedResponse = subscription.update(response, subscription.index);
      sendResponse(socket, updatedResponse);
    }, subscription.interval);

    if (subscriptionTimers[response.id]) {
      console.log(`timer already exists for ${subscription.path}`);
      clearInterval(subscriptionTimers[response.id]);
    }

    subscriptionTimers[response.id] = timer;

    return subscription.update(response, subscription.index);
  }

  return response;
}

function cancelAllSubscriptions() {
  Object.keys(subscriptionTimers).forEach(k => {
    clearInterval(subscriptionTimers[k]);
  });
  subscriptionTimers = {};
}

module.exports = {
  checkForActiveSubscription,
  cancelAllSubscriptions
};