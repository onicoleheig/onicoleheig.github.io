$(function () {

  const baseUrl = 'http://localhost:3000';

  function getUser(username) {
    return fetch(`${baseUrl}/users/${username}`)
      .then(res => res.json());
  }

  function getStats(username) {
    return fetch(`${baseUrl}/stats/${username}`)
      .then(res => res.json());
  }

  function getFollowing(username) {
    return fetch(`${baseUrl}/following/${username}`)
      .then(res => res.json());
  }

  function getFollowers(username) {
    return fetch(`${baseUrl}/followers/${username}`)
      .then(res => res.json());
  }
  //Global elements
  const ADD_USER_BUTTON = "images/add_user.png";

  /**
   * Initialize the content of the page
   */
  function initialize() {
    getData('LionelNanchen');
    getData('onicoleheig');
    getData('wasadigi');
    getData('paulnta');
    getData('edri');
    getData('mraheigvd');
  }

  function getData(username){
    return Promise.all([
      getUser(username),
      getStats(username),
      getFollowing(username),
      getFollowers(username),
    ])
      .then(([user, stats, following, followers]) => {
        stats.fg = following.length;
        stats.fr = followers.length;
        user.stats = stats;
        createFrame(user);
      })
      .catch(err => {
        console.error('Error ! cannot fetch data', err);
      });
  }

  /**
   * Create a frame with the user informations
   * @param user the user on which the frame will be created
   */
  function createFrame(user) {
    const row = $("#user-frame-row");
    const div = document.createElement("div");
    div.setAttribute("class", "col-lg-4 col-sm-6 text-center mb-4 user-frame");
    const buttonImg = document.createElement("img");
    buttonImg.setAttribute("class", "add-user-button");
    buttonImg.src = ADD_USER_BUTTON;
    const a = document.createElement("a");
    a.setAttribute("class", "user-frame-image");
    a.id = user.login.split(' ').join('-') + "-frame";
    const avatar = document.createElement("img");
    avatar.setAttribute("class", "rounded-circle img-fluid d-block mx-auto frame-avatar");
    avatar.src = user.avatar_url;
    a.appendChild(avatar);
    const h3 = document.createElement("h3");
    h3.setAttribute("class", "user-frame-name");
    h3.textContent = user.login;

    //append new elements
    div.appendChild(buttonImg);
    div.appendChild(a);
    div.appendChild(h3);
    row.append(div);

    //attach user to the frame
    $("#" + a.id).data(a.id, user);
  }

  //code inspired by https://www.w3schools.com/howto/howto_js_filter_lists.asp
  $(document).on("keyup", ".search-bar", function () {
    let input, filter, ul, li, a, i;
    input = document.getElementById("search-bar");
    filter = input.value.toUpperCase();
    div = document.getElementById("user-frame-row");
    frames = div.getElementsByClassName("user-frame");
    for (i = 0; i < frames.length; i++) {
        frame = frames[i];
        if (frame.innerHTML.toUpperCase().indexOf(filter) > -1) {
            frames[i].style.display = "";
        } else {
            frames[i].style.display = "none";
        }
    }
  });

  /**
  *  Check if the user is already in the list.
  *  @param String id  the id of the list-group-item corresponding to the user.
  */
  function isUserInList(id) {
    return $("#" + id).length > 0;
  }

  /**
  * Sort the users list
  */
  function sortUsersList() {
    let i, users, shouldSwitch;
    let list = document.getElementById("users-list");
    let switching = true;

    while (switching) {
      switching = false;
      users = list.getElementsByClassName("list-group-item");
      for (i = 0; i < (users.length - 1); ++i) {
        shouldSwitch = false;
        if (users[i].textContent.toLowerCase() > users[i + 1].textContent.toLowerCase()) {
          shouldSwitch = true;
          break;
        }
      }
      if (shouldSwitch) {
        users[i].parentNode.insertBefore(users[i + 1], users[i]);
        switching = true;
      }
    }
  }

  /**
  *  Action performed after click on the add-user-button button.
  *  Add the user in the user list.
  */
  $(document).on("click", ".add-user-button", function addUserToList() {
    //get user attach to the frame
    const frame = this.parentElement.getElementsByClassName("user-frame-image")[0];
    const frameId = frame.getAttribute("id");
    const user = $("#" + frameId).data(frameId);

    //id for the futur user a in the list
    const id = user.login.split(' ').join('-') + "-list";

    //check if user is already in the list
    if (isUserInList(id)) return;

    const a = document.createElement("a");
    a.setAttribute("href", "#");
    a.setAttribute("class", "list-group-item user-list");
    a.setAttribute("id", id);

    const spanUserName = document.createElement("span");
    spanUserName.setAttribute("class", "users-list-name")
    spanUserName.textContent = user.login;

    const button = document.createElement("button");
    button.setAttribute("type", "button");
    button.setAttribute("class", "close delete-user");
    button.setAttribute("aria-label", "Close");

    const span = document.createElement("span");
    span.setAttribute("aria-hidden", "true");
    span.innerHTML = "&times;";

    a.appendChild(spanUserName)
    button.appendChild(span);
    a.appendChild(button);

    const element = document.getElementById("users-list");
    element.appendChild(a);

    //attach user to user element in list
    $("#" + id).data(id, user);

    //sort the list
    sortUsersList();
  });

  /**
  *  Action performed after click on the compare users button
  *  Open model with the users comparison.
  */
  $(document).on("click", "#compare-user-btn", function() {
    //get users
    const userslist = $("#users-list").children();
    const alert = $("#compare-user-alert");

    //need at least 2 users to compare
    if (userslist.length < 2) {
      alert.html("Need at lest 2 users");
      setTimeout(() => alert.html(""), 1500);
      return;
    }
    //no more than 6 users (for readability purpose)
    else if (userslist.length > 6) {
      alert.html("No more than 6 users");
      setTimeout(() => alert.html(""), 1500);
      return;
    }

    //initialize array with all UserList objects
    let users = [];
    for (let i = 0; i < userslist.length; ++i) {
      const id = userslist[i].getAttribute("id")
      users.push($("#" + id).data(id));
    }

    //get table informations
    const table = $("#users-comparison-table");
    const headRow = $("#head-row");
    const rows = $("#sorted-tbody").children();

    //clear the table
    table.find("th").not("th").remove();
    table.find("td").not("th").remove();

    //users images
    for (let i = 0; i < users.length; i++) {
      const td = document.createElement("td");
      td.setAttribute("class", "text-center table-row");
      const img = document.createElement("img");
      img.setAttribute("src", users[i].avatar_url);
      img.setAttribute("class", "rounded-circle table-user-image");
      td.append(img);
      headRow.append(td);
    }

    //users names
    for (let i = 0; i < users.length; i++) {
      const td = document.createElement("td");
      td.class = "text-center table-row";
      td.textContent = users[i].login;
      rows[0].append(td);
    }

    //user infos
    let max = [0,0,0,0,0,0];
    let maxTd = [null, null, null, null, null, null];

    for (let i = 0; i < users.length; i++) {
      //commits
      let td = document.createElement("td");
      td.setAttribute("class", "table-row");
      let value = users[i].stats.c;
      td.textContent = value;
      rows[1].append(td);
      if (value > max[0]) {
        max[0] = value;
        maxTd[0] = td;
      }

      //++
      td = document.createElement("td");
      td.setAttribute("class", "table-row");
      value = users[i].stats.a;
      td.textContent = value;
      rows[2].append(td);
      if (value > max[1]) {
        max[1] = value;
        maxTd[1] = td;
      }

      //--
      td = document.createElement("td");
      td.setAttribute("class", "table-row");
      value = users[i].stats.d;
      td.textContent = value;
      rows[3].append(td);
      if (value > max[2]) {
        max[2] = value;
        maxTd[2] = td;
      }

      //ratio
      td = document.createElement("td");
      td.setAttribute("class", "table-row");
      value = Math.round((users[i].stats.a / users[i].stats.d) * 100) / 100;
      console.log(value);
      td.textContent = value;
      rows[4].append(td);
      if (value > max[3]) {
        max[3] = value;
        maxTd[3] = td;
      }

      //followers
      td = document.createElement("td");
      td.setAttribute("class", "table-row");
      value = users[i].stats.fr;
      td.textContent = value;
      rows[5].append(td);
      if (value > max[4]) {
        max[4] = value;
        maxTd[4] = td;
      }

      //following
      td = document.createElement("td");
      td.setAttribute("class", "table-row");
      value = users[i].stats.fg;
      td.textContent = value;
      rows[6].append(td);
      if (value > max[5]) {
        max[5] = value;
        maxTd[5] = td;
      }
    }

    //bold all
    for(i = 0; i < maxTd.length; ++i) maxTd[i].style.fontWeight = "bold";

    $("#users-comparison-table #sorted-head tr").sortable("refresh");

    //code inspired by https://johnny.github.io/jquery-sortable/#
    $("#users-comparison-table").sortable({
      containerSelector: "#users-comparison-table",
      itemPath: '> tbody',
      itemSelector: 'tr',
      placeholder: '<tr class="placeholder"/>'
    });

    var oldIndex;
    $('#sorted-head tr').sortable({
      containerSelector: 'tr',
      itemSelector: 'td',
      placeholder: '<th class="placeholder"/>',
      vertical: false,
      onDragStart: function ($item, container, _super) {
        oldIndex = $item.index();
        $item.appendTo($item.parent());
        _super($item, container);
      },
      onDrop: function  ($item, container, _super) {
        var field,
        newIndex = $item.index();

        if(newIndex != oldIndex) {
          $item.closest('table').find('tbody tr').each(function (i, row) {
            row = $(row);
            if(newIndex < oldIndex) {
              row.children().eq(newIndex).before(row.children()[oldIndex]);
            } else if (newIndex > oldIndex) {
              row.children().eq(newIndex).after(row.children()[oldIndex]);
            }
          });
        }
        _super($item, container);
      }
    });

    $("#compare-users-modal").modal();
  });

  /**
  *  Action performed after click on a user frame or user name in the users list.
  *  Open model with the user informations.
  */
  $(document).on("click", ".user-frame-image, .user-list", function () {

    //get user
    const id = this.getAttribute("id");
    user = $("#" + id).data(id);

    //title
    $("#user-info-modal-title").text(user.login);//CHANGE WITH USER NAME

    //image
    $("#user-modal-image").attr("src", user.avatar_url);//CHANGE WITH IMAGE

    //infos
    $("#user-infos-commit").text(user.stats.c);
    $("#user-infos-add").text(user.stats.a);
    $("#user-infos-del").text(user.stats.d);
    $("#user-infos-ratio").text(Math.round((user.stats.a / user.stats.d) * 100) / 100);
    $("#user-infos-followers").text(user.stats.fr);
    $("#user-infos-following").text(user.stats.fg);

    //open modal
    $("#user-info-modal").modal();
  });

  /**
  * Action performed after click on a cross in the users list.
  * Delete the user from the list.
  */
  $(document).on("click", ".delete-user", function (e) {
    e.stopPropagation();
    this.parentElement.parentElement.removeChild(this.parentElement);
  });

  //Initialization of the web page;
  initialize();
});
