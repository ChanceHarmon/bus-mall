'use strict';
console.log('connected');


/* Goals:
  I want to display 3 random images to the user. The user needs to click which product they like most out of the 3. When they click, that product needs to have it's vote count updated, and the total number of times the user has clicked needs to be updated as well. Each click will start a new round of voting, with 3 new random images. After the user has been through the test 25 times, I want to display to the user what each products total vote count came to be.
*/

/*Step One for me, Build an array to push to, build a Constructor to make objects for the images, run them all through the constructor

Properties:
vote count,
url,
name,
views,
maybe a seen flag, not sure yet*/

BusImage.totalClicks = 0;

BusImage.originals = ['bag.jpg', 'banana.jpg', 'bathroom.jpg', 'boots.jpg', 'breakfast.jpg', 'bubblegum.jpg', 'chair.jpg', 'cthulhu.jpg', 'dog-duck.jpg', 'dragon.jpg', 'pen.jpg', 'pet-sweep.jpg', 'scissors.jpg', 'shark.jpg', 'sweep.png', 'tauntaun.jpg', 'unicorn.jpg', 'usb.gif', 'water-can.jpg', 'wine-glass.jpg']

function BusImage(name) {
  this.votes = 0;
  this.url = `assets/${name}`;
  this.name = name.split('.')[0];
  this.views = 0;
  this.previouslyViewed = false;
  BusImage.array.push(this)
}

BusImage.array = [];

for (let i = 0; i < BusImage.originals.length; i++) {
  new BusImage(BusImage.originals[i])
}

/* Step 2, I don't care about to much of the random to begin with, but I need to be able to select html elements, apend the new image objects. Then an event listner to count clicks */

BusImage.left = document.getElementById('left');
BusImage.center = document.getElementById('center');
BusImage.right = document.getElementById('right');


function makeRandom() {
  return Math.floor(Math.random() * BusImage.originals.length);
}

function renderPics() {
  let display = [];
  //display[i] is an index dummy, you need to access that index of the array of objects


  display[0] = makeRandom();
  console.log(display[0])
  while (BusImage.array[display[0]].previouslyViewed === true) {
    console.log('image one', display[0])
    display[0] = makeRandom();
  }
  BusImage.array[display[0]].previouslyViewed = true;

  // so this got tricky as far as order of operations, but essentially we check first index for a flag of true, until it is not true we call random. When the loop is finished we set the flag to true, to prevent it from becomig a candidate in the next cycle of checking for the 1 index, and so on

  display[1] = makeRandom();
  while (BusImage.array[display[1]].previouslyViewed === true || display[1] === display[0]) {
    console.log('image two', display[1])
    display[1] = makeRandom();
  }
  BusImage.array[display[1]].previouslyViewed = true;



  display[2] = makeRandom();
  while (BusImage.array[display[2]].previouslyViewed === true || display[1] === display[2] || display[0] === display[2]) {
    console.log('image three', display[2])
    display[2] = makeRandom();
  }
  BusImage.array[display[2]].previouslyViewed = true;



  BusImage.left.src = BusImage.array[display[0]].url;
  BusImage.left.alt = BusImage.array[display[0]].name;
  BusImage.left.id = BusImage.array[display[0]].name;
  BusImage.array[display[0]].views += 1;

  BusImage.center.src = BusImage.array[display[1]].url;
  BusImage.center.alt = BusImage.array[display[1]].name;
  BusImage.center.id = BusImage.array[display[1]].name;
  BusImage.array[display[1]].views += 1;

  BusImage.right.src = BusImage.array[display[2]].url;
  BusImage.right.alt = BusImage.array[display[2]].name;
  BusImage.right.id = BusImage.array[display[2]].name;
  BusImage.array[display[2]].views += 1;



  //The next steps seem odd, and I am sure there is a better way, but this is what is happening. We had set the flags to true above to control the random aspect before being appended, now that is finished we set every flag to false again, this clears out any previous flags that are still considered true, like a reset, and then sets the current random indexes to true for the next handle click call


  /* Set flags to empty, then set the current pics to true on the previous viewed flag */
  for (let i = 0; i < BusImage.array.length; i++) {
    BusImage.array[i].previouslyViewed = false;
    //console.log(BusImage.array[i])
  }
  BusImage.array[display[0]].previouslyViewed = true;
  BusImage.array[display[1]].previouslyViewed = true;
  BusImage.array[display[2]].previouslyViewed = true;
  console.log('after setting flags to true', BusImage.array)

}

/*Step 3, random is working and we are successfully changing the images in the DOM. Now, We need a click handler, and click counter, and some way to stop repeat images in the same 2 rounds. */

BusImage.section = document.getElementById('images');

function clickHandler() {
  BusImage.totalClicks += 1;
  if (BusImage.totalClicks > 10) {
    BusImage.section.removeEventListener('click', clickHandler)
    finalTally();
  }
  if (event.target.id === 'images') return alert('Please select one of the products.');

  for (let i = 0; i < BusImage.originals.length; i++) {
    if (event.target.id === BusImage.array[i].name) {
      BusImage.array[i].votes += 1;
    }
  }
  renderPics()
}

/* This final Tally function was a lot of fun. I sat down with my 8 year old son and explained what we were trying to do, and showing him the live-server at the same time. We talked out every detail, and step by step got it work perfectly! */
function finalTally() {
  for (let i = 0; i < BusImage.array.length; i++) {
    console.log(BusImage.array[i])
    let image = BusImage.array[i];
    /* 
    Steps to do:
    Create an li done
    give it content based on the object at [i] (make our sentence) done
    append the li to the parent ul element (paste our sentence to our list on the internet)
    */
    let tallyString = document.createElement('li');
    // Should tell the client the name of the product, how many times it was shown, how many times it was voted for.
    if (image.views === 0) {
      tallyString.innerText = `The ${image.name} product was never shown, so of course it has no votes, let's pick it up marketing team...`
    } else if (image.views === 1) {
      if (image.votes === 0) {
        tallyString.innerText = `The ${image.name} product was shown ${image.views} time, and was never voted for... :(`
      } else if (image.votes === 1) {
        tallyString.innerText = `The ${image.name} product was shown ${image.views} time, and was voted for ${image.votes} time. Not bad!`
      }
    } else {
      if (image.votes === 0) {
        tallyString.innerText = `The ${image.name} product was shown ${image.views} times, and was never voted for... :(`
      } else if (image.votes === 1) {
        tallyString.innerText = `The ${image.name} product was shown ${image.views} times, and was voted for only ${image.votes} time...`
      } else {
        tallyString.innerText = `The ${image.name} product was shown ${image.views} times, and was voted for ${image.votes} times!!!`;
      }
    }
    document.getElementById('final_tally').appendChild(tallyString)
  }
}


BusImage.section.addEventListener('click', clickHandler)
renderPics();