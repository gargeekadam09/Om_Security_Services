// Get Current Year
function getCurrentYear() {
    var d = new Date();
    var year = d.getFullYear();
    document.querySelector("#displayDateYear").innerText = year;
}
getCurrentYear()

//client section owl carousel
$(".owl-carousel").owlCarousel({
    loop: true,
    margin: 10,
    nav: true,
    dots: false,
    navText: [
        '<i class="fa fa-long-arrow-left" aria-hidden="true"></i>',
        '<i class="fa fa-long-arrow-right" aria-hidden="true"></i>'
    ],
    autoplay: true,
    autoplayHoverPause: true,
    responsive: {
        0: {
            items: 1
        },
        768: {
            items: 2
        },
        1000: {
            items: 2
        }
    }
});


// scroll event and control
let nav = document.querySelector(".top-navbar-nav");

document.addEventListener("scroll", () => {
  let scroll = window.scrollY; 

  if (scroll > 200) {
    nav.style.display = "flex";
  } else {
    nav.style.display = "none";
  }
  
});



// form submition and control
let submitBtn = document.querySelector(".sent-msg");
let contactForm = document.querySelector("#contact-form");
let sentInfo = document.querySelector(".sent");
let contactCont = document.querySelector(".contact-us-content");


let formAddress = "https://docs.google.com/forms/d/e/1FAIpQLSdvoRWy88bbSeutG9JvT8sevI7K5p58zJdfpjA/formResponse";
let success = `
<span class="star"> &#10042 </span>
<span>Thanks, we receive your message <span>
<span class="star"> &#10042 </span>
`;
let failure = `
<span class="star star-red"> &#10008 </span>
<span>Error sending message <span>
<span class="star star-red"> &#10008 </span>
`;


contactCont.addEventListener("click", () => {
  sentInfo.style.visibility = "hidden";
})

contactForm.addEventListener("submit", function(event) {
  event.preventDefault();
  
  // deactivate the submit button
  submitBtn.style.opacity = 0.8;
  submitBtn.style.pointerEvents = "none";
  submitBtn.innerHTML = "<span class='loading'> sending ... </span>";
  
  // prepare the form data
  const form = event.target;
  let formDataObj = {};
  const formData = new FormData(form);
  formData.forEach((value, key) => {
    formDataObj[key] = value;
  });
  
  console.log(formDataObj);
  
  fetch(formAddress, {
      method: "POST",
      mode: "no-cors",
      body: new URLSearchParams(formDataObj)
    })
    .then(() => {
      sentInfo.innerHTML = success;
      reset(form);
    })
    .catch((error) => {
      sentInfo.innerHTML = failure;
      console.error("Error:", error);
      reset(form);
    });
  
});

function reset(form) {
  form.reset();
  submitBtn.style.opacity = 1;
  submitBtn.style.pointerEvents = "auto";
  submitBtn.innerHTML = "<span> Send </span>";
  sentInfo.style.visibility = "visible";
  setTimeout(() => {
    sentInfo.style.visibility = "hidden";
  }, 3000)
}