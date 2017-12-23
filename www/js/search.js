var parameters = getQueryParameters();

var searchTermsDiv = document.getElementsByClassName("search-info-terms")[0];
searchTermsDiv.innerHTML = parameters.q || "";

var resultList = document.getElementsByClassName("search-things")[0];

var filterType = document.getElementById("filter-type");
var type = parameters.type || "";
filterType.onchange = function () {
	//todo set the location?
	type = filterType.value;
	search();
}

var loadSearchResults = function (results) {
	
   resultList.innerHTML = "";
   results.forEach(function (result) {
      var resultDiv = document.createElement("div");
      resultDiv.className = "search-thing";

      var resultData = document.createElement("div");
      resultData.className = "search-thing-image";
      resultData.innerHTML = "&nbsp;"
      resultData.style.backgroundColor = getBackgroundColor(result.type);
      resultDiv.appendChild(resultData);

      resultData = document.createElement("div");
      resultData.className = "search-thing-type";
      resultData.innerHTML = result.partType || result.type;
      resultDiv.appendChild(resultData);

      resultData = document.createElement("div");
      resultData.className = "search-thing-title";
      resultData.innerHTML = result.name || result.tags || "";
      resultDiv.appendChild(resultData);

      resultData = document.createElement("div");
      resultData.className = "search-thing-user";
      resultData.innerHTML = result.username ? "by " + result.username : "";
      resultDiv.appendChild(resultData);

      var rightData = document.createElement("div");
      rightData.className = "search-thing-right-data";
      resultDiv.appendChild(rightData);

      resultData = document.createElement("div");
      resultData.className = "search-thing-votes";
      resultData.innerHTML = (result.votes || "0") + " votes";
      rightData.appendChild(resultData);

      resultData = document.createElement("div");
      resultData.className = "search-thing-created-at";
      //resultData.innerHTML = getTimeCaption(parseInt(result.created_at));
      resultData.innerHTML = getTimeCaption(parseInt(result.last_modified));
      rightData.appendChild(resultData);

      resultDiv.onclick = function () {
		 var page;
		 if (result.type == "SOUNDSET")
		    page = "soundset.htm";
		 else
		    page = "viewer.htm";
		    
         window.location = page + "?id=" + result.id;
      };
      resultList.appendChild(resultDiv);
   });
};

var search = function (params) {
	var xhr = new XMLHttpRequest();
	var url = "data/?q=" + (params.q || "");
	if (params.type) {
            url = url + "&type=" + params.type;
	}
	if (params.page) {
            url = url + "&page=" + params.page;
	}
        
	xhr.open("GET", url);
	xhr.onreadystatechange = function () {
	   var results;
	   if (xhr.readyState == 4) {
		  console.log(xhr.responseText);
		  try {
			 results = JSON.parse(xhr.responseText);
		  }
		  catch (exception) {
			 resultList.innerHTML = "Error parsing search results.";
			 return;
		  }
		  loadSearchResults(results);
	   }
	};
	xhr.send();
};

search(parameters);

function getQueryParameters() {

	// see if there's somethign to do here
	var params = document.location.search;
	var nvp;
   var parsedParams = {};
	
	if (params.length > 1) {
		params.slice(1).split("&").forEach(function (param) {
			nvp = param.split("=");
         parsedParams[nvp[0]] = nvp[1];
		});
	}
	
   return parsedParams;
}

function getBackgroundColor(type) {
   if (type === "SONG") {
      return "#99FF99";
   }

   if (type === "SECTION") {
      return "#99AAFF";
   }

   if (type == "PART" || type === "MELODY" || 
		type === "DRUMBEAT" || type === "BASSLINE") {
      return "#FFFF99";
   }

   if (type === "SOUNDSET") {
      return "#FF9999";
   }

   return "#808080";
}


function getTimeCaption(timeMS) {

    if (!timeMS) {
        return "";
    }

    var seconds = Math.round((Date.now() - timeMS) / 1000);
    if (seconds < 60) return seconds + " sec ago";

    var minutes = Math.floor(seconds / 60);
    if (minutes < 60) return minutes + " min ago";    
   
    var hours = Math.floor(minutes / 60);
    if (hours < 24) return hours + " hr ago";    

    var days = Math.floor(hours / 24);
    if (days < 7) return days + " days ago";

    var date  = new Date(timeMS);
    var months = ["Jan", "Feb", "Mar", "Apr", "May",
                "Jun", "Jul", "Aug", "Sep", "Oct", 
                "Nov", "Dec"];
    var monthday = months[date.getMonth()] + " " + date.getDate();
    if (days < 365) {
	    return monthday;
    }
    return monthday + " " + date.getFullYear();
};

