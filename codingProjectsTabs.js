function selectTab(evt, tabName) {
    // Declare all variables
    var i, allLinks, tabcontent, tablinks;

    tabcontent = document.getElementsByClassName("tabcontent");
    for (i = 0; i < tabcontent.length; i++) {
        tabcontent[i].style.display = "none";
    }

    // Get all elements with class="tablinks" and remove the class "active"
    tablinks = document.getElementsByClassName("tablinks");
    for (i = 0; i < tablinks.length; i++) {
        tablinks[i].className = "tablinks " + tabName + "-atab";
    }

    // Color all links
    allLinks = document.getElementsByTagName("a");
    for (i = 0; i < allLinks.length; i++) {
        if ( !allLinks[i].className.includes("tablinks") ) {
            allLinks[i].className = tabName + "-a";
        }
    }

    document.getElementById("tabBar").className = "tab " + tabName + "-tab";
    document.getElementById("copyrightFooter").className = "footer " + tabName + "-footer";

    // Show the current tab, and add an "active" class to the link that opened the tab
    document.getElementById(tabName).style.display = "block";
    evt.currentTarget.className += " active";
}

document.getElementById("introLink").click();