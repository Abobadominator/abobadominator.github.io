var isMobileSize = window.matchMedia("(max-width: 630px)");
var isHoverDevice = window.matchMedia("(hover: hover)");
var isDesktop = window.matchMedia("(min-width: 631px)");

$(document).ready(function () {
  // Intro Animation - only on home page
  function initIntroAnimation() {
    // Only run on home page
    if (!$('body').hasClass('page-home')) {
      return;
    }

    // Add intro overlay to body
    $('body').addClass('intro-active').prepend(`
      <div class="intro-overlay">
        <div class="intro-brackets">
          <span class="bracket">[</span>
          <span class="bracket">]</span>
        </div>
      </div>
    `);

    // Handle scroll event for animation
    let hasScrolled = false;
    let scrollTimeout;

    function handleScroll() {
      if (!hasScrolled && $(window).scrollTop() > 50) {
        hasScrolled = true;

        // Start zoom animation
        $('.intro-brackets').addClass('zoomed');

        // After zoom animation completes
        setTimeout(() => {
          // Hide intro overlay
          $('.intro-overlay').addClass('hidden');

          // Show main content
          $('.content').addClass('visible');

          // Remove intro-active class from body and clean up
          setTimeout(() => {
            $('body').removeClass('intro-active');
            $('.intro-overlay').remove();

            // Reset scroll position
            window.scrollTo(0, 0);
          }, 500);
        }, 1500);

        // Remove scroll listener
        $(window).off('scroll', handleScroll);
      }
    }

    // Add scroll listener
    $(window).on('scroll', handleScroll);

    // Add click handler as fallback
    $('.intro-overlay').on('click', function () {
      if (!hasScrolled) {
        handleScroll();
      }
    });
  }

  // Initialize intro animation
  initIntroAnimation();

  // lazy load

  var ll = new LazyLoad({
    threshold: 3000,
    class_error: "lz-error",
  });

  // smooth scroll

  $(".smooth").click(function (e) {
    e.preventDefault();
    var scrollTop = $("body").scrollTop() + $(".projects").offset().top - $("#nav").outerHeight();
    $("html,body").animate({ "scrollTop": scrollTop }, 1200);
  });

  // set content height

  var navHeight = $("#nav").outerHeight() * 2;
  $(".content").css({ "min-height": "calc(100vh - " + navHeight + "px)" });

  // project lightbox

  $(".page-project section.grid img").click(function () {

    $("#nav").addClass("hide");

    $(this).addClass("start-lightbox");

    var index = getImageIndex();

    var splide = new Splide(".splide", {
      type: "fade",
      rewind: true,
      pagination: false,
      start: index
    });

    splide.mount();

    $(".lightbox").addClass("active");

    $(".click-area.next").click(function () {
      $(".splide__arrow--next").click();
    });

    $(".click-area.prev").click(function () {
      $(".splide__arrow--prev").click();
    });

    $(".close").click(function () {
      $(".page-project section img").removeClass("start-lightbox");
      $(".lightbox").removeClass("active");
      $("#nav").removeClass("hide");
      setTimeout(function () {
        splide.destroy();
      }, 300);
    });

    $(document).keyup(function (e) {
      if (e.keyCode === 27) {
        $(".close").click();
      }
    });

  });

  function getImageIndex() {
    var imageIndex;
    $("section figure:not(.mobile) img").each(function (i) {
      if ($(this).hasClass("start-lightbox")) {
        imageIndex = i;
      }
    });
    return imageIndex;
  }

  // profile and studio pages

  if ($("body").hasClass("page-profile") || $("body").hasClass("page-studio")) {

    $(".text a").each(function () {
      var thisLink = $(this);
      var absolutePath = getAbsolutePath(thisLink.attr("href"));

      if (absolutePath.indexOf("projects/") != -1) {

        var projectPath = absolutePath.split("projects/", 1)[1];

        $.ajax({
          url: absolutePath,
          type: 'GET',
          success: function (data) {
            var pagehtml = $(data);
            var projectThumb = pagehtml.find(".hover-thumb");
            thisLink.append(projectThumb);
            adjustThumbnails();
          }
        });

      } else if (absolutePath.indexOf("studio/") != -1) {

        var projectPath = absolutePath.split("studio/", 1)[1];

        $.ajax({
          url: absolutePath,
          type: 'GET',
          success: function (data) {
            var pagehtml = $(data);
            var projectThumb = pagehtml.find(".hover-thumb");
            thisLink.append(projectThumb);
            thisLink.attr("href", "");
            adjustThumbnails();
          }
        });

      } else {

        thisLink.addClass("no-hover");

      }

    });

    if (isMobileSize.matches) {
      $(window).click(function () {
        $(".text a:not(.no-hover)").removeClass("show-thumb");
      });
      $(".text a:not(.no-hover)").click(function (e) {
        if (!$(this).hasClass("show-thumb")) {
          e.preventDefault();
          e.stopPropagation();
          $(this).addClass("show-thumb");
        }
      });
    }

    $(window).resize(function () {
      adjustThumbnails();
    });

  }

  function getAbsolutePath(href) {
    var link = document.createElement("a");
    link.href = href;
    return link.href;
  }

  // logo text 

  logoFadeTimer = null;

  if ($("body").hasClass("page-home") || $("body").hasClass("page-projects")) {

    if ($("body").hasClass("page-projects")) {
      printLogotype();
      initProjectHover();
      var scrollTop = $("html,body").scrollTop() + $(".projects").offset().top - $("#nav").outerHeight();
      $("html,body").scrollTop(scrollTop);
    }

    if ($("body").hasClass("page-home")) {
      initLogotype();
    }

    $(window).scroll(function () {
      var isScrolledToTop = $("html,body").scrollTop() == 0;

      if (isScrolledToTop && !$("body").hasClass("no-scroll")) {
        var timeoutDur = 1;
        setTimeout(function () {
          if ($('html, body').scrollTop() == 0) {
            initLogotype();
          }
        }, timeoutDur);
      }
    });

  } else if (!$("body").hasClass("page-logos")) {
    printLogotype();
  }

  // logotypes
  if (!$("body").hasClass("page-home")) {
    printLogotypes();
  }

  if ($("body").hasClass("page-project")) {
    initProjectHover();
  }

  // secret studio and mask click

  var waittimeToLoad = $(".artboard-mask").attr("data-waittime") * 1000 / 2;
  setTimeout(function () {
    var src = $(".artboard-mask .artboard").attr("data-src");
    $(".artboard-mask .artboard").attr("src", src);
  }, waittimeToLoad);

  $(".artboard-mask").click(function () {
    if (!$(this).hasClass("expand")) {
      $("#nav").addClass("adjustZ");
      $(this).css({ "left": $(this).offset().left, "top": $(this).offset().top });
      var glitchArray = [];
      var totalGlitches = 20;
      var durationMax = 1000;
      for (j = 0; j <= totalGlitches; j++) {
        glitchArray.push(Math.floor(Math.random() * durationMax) + 1);
      }
      glitchArray.sort();
      for (j = 0; j < glitchArray.length; j++) {
        setTimeout(function () {
          $(".artboard-mask").toggleClass("glitch");
        }, glitchArray[j]);
      }
      setTimeout(function () {
        $("body").addClass("no-scrolling");
      }, durationMax);
      $(this).addClass("expand");
      window.history.pushState('', '', secretStudioURL);
      setTimeout(function () {
        if (navigator.platform.indexOf('Mac') > -1) {
          $(".figma-instructions.mac").addClass("show");
        } else {
          $(".figma-instructions.windows").addClass("show");
        }
        setTimeout(function () {
          $(".figma-instructions").removeClass("show");
        }, 16000)
        if ($("body").hasClass("page-projects")) {
          $("#nav div:first-child a").click(function () {
            window.location = 'projects';
          });
        }
      }, 3000);
    }
  });

  if ($("body").hasClass("page-secret-studio")) {
    var src = $(".artboard-mask .artboard").attr("data-src");
    $(".artboard-mask .artboard").attr("src", src);
    $(".artboard-mask").addClass("show expand glitch");
    setTimeout(function () {
      if (navigator.platform.indexOf('Mac') > -1) {
        $(".figma-instructions.mac").addClass("show");
      } else {
        $(".figma-instructions.windows").addClass("show");
      }
      setTimeout(function () {
        $(".figma-instructions").removeClass("show");
      }, 16000)
    }, 3000);
  }

  var waittime = parseInt($(".artboard-mask").attr("data-waittime")) * 1000;
  var activityTimeout = setTimeout(inActive, waittime);

  function resetActive() {
    clearTimeout(activityTimeout);
    activityTimeout = setTimeout(inActive, waittime);
  }

  function inActive() {
    $(".artboard-mask").addClass("show");
  }

  $(document).bind('mousemove', function () {
    if (!$(".artboard-mask").hasClass("show")) {
      resetActive();
    }
  });

  $("body").bind('mousemove', function () {
    if (!$(".artboard-mask").hasClass("show")) {
      resetActive();
    }
  });

  $(document).bind('scroll keypress click', function () {
    if (!$(".artboard-mask").hasClass("expand")) {
      $(".artboard-mask").removeClass("show");
      resetActive();
    }
  });

  $("body").bind('scroll keypress click', function () {
    if (!$(".artboard-mask").hasClass("expand")) {
      $(".artboard-mask").removeClass("show");
      resetActive();
    }
  });

  // load employment pages via ajax

  $(document).on("click", ".position-titles a", function (e) {
    e.preventDefault();
    $(".position-titles a").removeClass("active");
    $(this).addClass("active");
    openURL($(this).attr("href"));
  });

});

// logo drawing on mobile 

function preventDefault(e) {
  e.preventDefault();
}

// project hover 

function initProjectHover() {
  if (!isHoverDevice.matches) {
    return;
  }
  $(".project, .related-project").mouseenter(function () {
    $(".project, .related-project").addClass("hide");
    $(this).addClass("show");
  });
  $(".project, .related-project").mouseleave(function () {
    $(".project, .related-project").addClass("no-delay").removeClass("hide");
    setTimeout(function () {
      $(".project, .related-project").removeClass("no-delay");
    }, 10)
    $(this).removeClass("show");
  });
}

function unbindProjectHover() {
  $(".project, .related-project").unbind("mouseenter");
  $(".project, .related-project").unbind("mouseleave");
}

// init logotype

function initLogotype() {

  unbindProjectHover();
  $(window).unbind("touchmove");
  $(window).unbind("mousemove");
  clearTimeout(logoFadeTimer);
  $(".logotype").html("").removeClass("hide").removeClass("print reposition");
  var url = window.location.href;
  var newUrl = url.replace("projects", "");
  $("body").removeClass("page-projects").addClass("page-home");
  window.history.pushState({}, null, newUrl);

  logoText = "Snarkitecture";
  logoTextArr = logoText.split("");
  i = 0;
  fontSize = parseInt($(".large").css("font-size"));
  spacingY = fontSize * 0.9;
  spacingX = fontSize * 0.7;
  scale = fontSize / 92;
  xLimit = false;
  yLimit = false;

  // fix for logo drawing on Android devices, which do not support touchmove

  $(window).bind("touchmove", function (e) {
    e.preventDefault();
    var event = window.event;
    drawLogo(event.touches[0]);
  });

  $(window).bind("mousemove", function (e) {
    e.preventDefault();
    drawLogo(e);
  });

}

function drawLogo(e) {

  var marginEdge = 80;

  // place first letter 
  if ((i == 0) && (e.pageX >= marginEdge && e.pageX <= $(window).width() - marginEdge) && (e.pageY >= marginEdge && e.pageY <= $(window).height() - marginEdge)) {
    posX = e.pageX;
    posY = e.pageY;
    $(".logotype").append("<div class='position-data' scale='" + scale + "' data-win-width='" + $(window).width() + "' data-win-height='" + $(window).height() + "' data-width='" + $(window).width() / scale + "' data-height='" + $(window).height() / scale + "'></div><div class='letter-wrapper'></div>");
    $(".logotype .letter-wrapper").append("<div class='letter' style='position: absolute; left: " + posX + "px; top: " + posY + "px;'>" + logoTextArr[i] + "</div>");
    i++;
  }

  // place next letter
  if ((i > 0 && i <= logoTextArr.length) && (e.pageX >= marginEdge && e.pageX <= $(window).width() - marginEdge) && (e.pageY >= marginEdge && e.pageY <= $(window).height() - marginEdge)) {
    if (Math.abs(e.pageX - posX) >= spacingX && Math.abs(e.pageY - posY) >= spacingY) {
      if ((Math.abs(Math.abs(e.pageX - posX) - spacingX)) < (Math.abs(Math.abs(e.pageY - posY) - spacingY))) {
        xLimit = true;
      } else {
        yLimit = true;
      }
    }
    // if we hit the spacingX limit
    if (Math.abs(e.pageX - posX) >= spacingX || xLimit == true) {
      if (e.pageX - posX >= 0) {
        newPosX = posX + spacingX;
        calcSpacingX = spacingX;
      } else {
        newPosX = posX - spacingX;
        calcSpacingX = -1 * spacingX;
      }
      var slope = (e.pageX - posX) / (e.pageY - posY);
      var newPosY = calcSpacingX / slope + posY;
      posX = newPosX;
      posY = newPosY;
      $(".logotype .letter-wrapper").append("<div class='letter' style='position: absolute; left: " + posX + "px; top: " + posY + "px;'>" + logoTextArr[i] + "</div>");
      i++;
      xLimit = false;
    }
    // if we hit the spacingY limit
    else if (Math.abs(e.pageY - posY) >= spacingY || yLimit == true) {
      if (e.pageY - posY >= 0) {
        newPosY = posY + spacingY;
        calcSpacingY = spacingY;
      } else {
        newPosY = posY - spacingY;
        calcSpacingY = -1 * spacingY;
      }
      var slope = (e.pageX - posX) / (e.pageY - posY);
      var newPosX = calcSpacingY * slope + posX;

      posX = newPosX;
      posY = newPosY;
      $(".logotype .letter-wrapper").append("<div class='letter' style='position: absolute; left: " + posX + "px; top: " + posY + "px;'>" + logoTextArr[i] + "</div>");
      i++;
      yLimit = false;
    }
  }

  // save logotype
  if (i == logoTextArr.length) {
    i++;
    setTimeout(function () {
      $("body").removeClass("no-scroll");
      $("html").removeClass("overflow-hidden");
      var scrollTop = $("body").scrollTop() + $(".projects").offset().top - $("#nav").outerHeight();
      $("html,body").animate({ "scrollTop": scrollTop }, 1200);

      $("nav.main div:first-child a").addClass("active");
      setTimeout(function () {
        newUrl = window.location.href + "projects";
        window.history.pushState({}, null, newUrl);
        $("body").removeClass("page-home").addClass("page-projects");
      }, 1000);
    }, 800);
    setTimeout(function () {
      initProjectHover();
      logoFadeTimer = setTimeout(function () {
        $(".logotype").addClass("hide");
      }, 4000);
    }, 1800);

    // add location and time data
    $.getJSON("https://api.ipify.org/?format=json", function (e) {
      var ip = e.ip;
      $.getJSON("https://ipapi.co/" + ip + "/json", function (e) {
        var city = e.city;
        var country = e.country;
        if (city != '' && country != null) {
          var location = city + ", " + country;
        } else {
          var location = '';
        }
        var d = new Date();
        var date = d.toLocaleString();
        date = date.replace(/,/g, "");
        var multiplier = 1 / scale;
        var logotypeToSave = $(".logotype").clone();
        logotypeToSave.find(".letter").each(function () {
          var left = parseInt($(this).css("left")) * multiplier;
          var top = parseInt($(this).css("top")) * multiplier;
          $(this).css({ "left": left + "px", "top": top + "px" });
        });
        logotypeToSave.append('<div class="meta small"><div class="date">' + date + '</div><div class="location">' + location + '</div></div>');
        var logotype = logotypeToSave.html();
        saveLogotype(logotype);
      });
    });
  }

}

// save logotype

function saveLogotype(logotype) {
  $.ajax({
    type: "POST",
    url: "https://www.snarkitecture.com/assets/js/logotype.php",
    data: {
      'logotype': logotype,
    },
    dataType: "json",
    success: function (data) {
    },
  });
}

// print logotype

function printLogotype() {
  $.ajax({
    type: "GET",
    url: "https://www.snarkitecture.com/assets/js/logotype.php",
    dataType: "json",
    success: function (data) {
      var logotype = String(data.logotype);
      if (!$("body").hasClass("page-secret-studio")) {
        $(".logotype").append(logotype);

        // check if winw and winh have changed
        logoWinW = $(".position-data").attr("data-win-width");
        logoWinH = $(".position-data").attr("data-win-height");
        if ($(window).width() != logoWinW || $(window).height() != logoWinH) {

          $(".logotype-wrapper").each(function () {
            var leastL = 100000000;
            var leastT = 100000000;
            var mostL = 0;
            var mostT = 0;
            $(this).find(".letter").each(function () {
              var thisL = parseInt($(this).css("left"));
              if (thisL < leastL) {
                leastL = thisL;
              }
              if (thisL > mostL) {
                mostL = thisL;
              }
              var thisT = parseInt($(this).css("top"));
              if (thisT < leastT) {
                leastT = thisT;
              }
              if (thisT > mostT) {
                mostT = thisT;
              }
            });
            $(this).find(".letter").each(function () {
              $(this).css({ "left": "-=" + leastL, "top": "-=" + leastT });
            });
            $(".logotype").addClass("reposition").css({
              "width": mostL - leastL + "px",
              "height": mostT - leastT + "px"
            });
          });

        }
      }

      setTimeout(function () {
        $(".logotype").addClass("hide");
      }, 4000);

    },
    error: function (err) {
      console.error('error', err);
    }
  });
}

function printLogotypes() {
  return $.ajax({
    type: "GET",
    url: "https://www.snarkitecture.com/assets/js/logotypes.php",
    dataType: "json",
    success: function (data) {
      data.reverse().forEach(function (item, index) {
        setTimeout((function (item) {
          return function () {
            var $thisLogotype = $(item);
            resizeLogotype($thisLogotype);
            $thisLogotype.appendTo(".logos");
            var height = $thisLogotype.height();
            var div = $thisLogotype.css("transform");
            var values = div.split('(')[1];
            values = values.split(')')[0];
            values = values.split(',');
            var a = values[0];
            var b = values[1];
            var scale = Math.sqrt(a * a + b * b);
            $thisLogotype.css({ "margin-bottom": -1.5 * height * scale });
          }
        })(item), 1);
      });

      // clicking on letter to load logos

      $(document).on("click", ".letter", function () {
        $(".logos").addClass("active");
        $("body").addClass("no-scroll");
      });

      $(document).on("click", ".logos .close", function () {
        $(".logos").removeClass("active");
        $("body").removeClass("no-scroll");
        if ($("body").hasClass("page-logos")) {
          window.location = 'https://www.snarkitecture.com/';
        }
      });

      $(window).resize(function () {
        $(".logos .logotype-wrapper").each(function () {
          var height = $(this).height();
          var div = $(this).css("transform");
          var values = div.split('(')[1];
          values = values.split(')')[0];
          values = values.split(',');
          var a = values[0];
          var b = values[1];
          var scale = Math.sqrt(a * a + b * b);
          $(this).css({ "margin-bottom": -1 * height * scale });
        });
      });
    },
    error: function (err) {
      console.error('error', err);
    }
  });
}

function resizeLogotype($thisLogotype) {
  var leastL = 100000000;
  var leastT = 100000000;
  var mostL = 0;
  var mostT = 0;
  $thisLogotype.find(".letter").each(function () {
    var thisL = parseInt($(this).css("left"));
    if (thisL < leastL) {
      leastL = thisL;
    }
    if (thisL > mostL) {
      mostL = thisL;
    }
    var thisT = parseInt($(this).css("top"));
    if (thisT < leastT) {
      leastT = thisT;
    }
    if (thisT > mostT) {
      mostT = thisT;
    }
  });
  $thisLogotype.find(".letter").each(function () {
    $(this).css({ "left": "-=" + leastL, "top": "-=" + leastT });
  });
  $thisLogotype.find(".letter-wrapper").css({ "width": mostL - leastL, "height": mostT - leastT })
  $thisLogotype.find(".meta").css({ "top": mostT - leastT });
}

function openURL(href) {
  var link = href;
  $.ajax({
    url: link,
    type: 'GET',
    cache: false,
    success: function (result) {
      var positionDesc = $(result).find(".position-description").html();
      $(".position-description").html(positionDesc);
    }
  });
  window.history.pushState({ href: href }, '', href);
}

$(window).on("popstate", function (e) {
  var segments = location.pathname.split("/");

  var path = segments[segments.length - 2];
  console.log(path);
  if (path == 'employment') {
    openURL(location.href);
  } else {
    // location.reload();
  }
});

function adjustThumbnails() {
  topOfFooter = $(".footer").offset().top;
  $(".text a .hover-thumb").each(function () {
    if ($(this).offset().top + $(this).height() > topOfFooter) {
      $(this).css({ "bottom": "0" });
    } else {
      $(this).css({ "bottom": "unset" });
    }
  })
}

function disableScroll() {
  document.body.addEventListener('touchmove', preventDefault, { passive: false });
}

function enableScroll() {
  document.body.removeEventListener('touchmove', preventDefault);
}


