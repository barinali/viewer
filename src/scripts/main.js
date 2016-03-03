var	$tabLinks = document.querySelectorAll('#tab-list .tab-link');
var $tabList = document.querySelector('#tab-list');

var $viewList = document.querySelector('#view-list');

// check indexeddb
var db = new Dexie('Viewer');

var tabs = [];

db
  .version(1)
  .stores({
    tabs: '++id, title, url'
  });

db.open()
  .catch(function(error) {
    console.log("Uh oh!", error);
  });

db.tabs.toArray(function(tabsArr) {
  tabs = tabsArr;
});

var updateTabs = function() {
  db.tabs.reverse().toArray(function(tabsArr) {
    for(var index = 0; index < tabsArr.length; index++) {
      var tmpTap = tabsArr[index];
      var $tmpLink = addNewTab(tmpTap.id, tmpTap.title, tmpTap.url, false);
      $tmpLink.addEventListener('click', tabClick);
      $tmpLink.addEventListener('dblclick', tabDblClick);
    }
  });
};

var tabClick = function(event) {
  event.preventDefault();

  var $this = event.target;

  if(document.querySelector('.tab-link.active'))
    document.querySelector('.tab-link.active').classList.remove('active');

  if(document.querySelector('.view.active'))
    document.querySelector('.view.active').classList.remove('active');

  var $targetView = document.getElementById($this.dataset.view);
  if (!$targetView.classList.contains('active'))
    $this.classList.add('active');
    $targetView.classList.add('active');
};

var tabDblClick = function(event) {
  var $this = event.target;

  db.tabs.where('title').equals($this.text).delete().then(function() {
    console.log("deleted");
    $this.remove();
  });
};

var getNewId = function() {
  return document.querySelectorAll('.tab-link').length++;
};

var checkActiveTab = function() {
  return document.querySelector('.tab-link.active') ? true : false;
};

var createTabLink = function() {
  var $tmpLink = document.createElement('a');
  $tmpLink.classList.add('tab-link');

  var removeBtn = document.createElement('span');
  removeBtn.text = '[-]';
  $tmpLink.appendChild(removeBtn);

  removeBtn.addEventListener('click', function(event) {
    var $this = event.target;
  });

  return $tmpLink;
};

var createView = function(url) {
  var $tmpView = document.createElement('webview');
  $tmpView.classList.add('view');
  $tmpView.setAttribute('src', url);

  return $tmpView;
};

var $addNew = document.querySelector('.add-new');
var addNewTab = function(id, title, url, newTab) {
  if(typeof newTab === 'undefined') newTab = true;
  var $tabLink = createTabLink();
  $tabLink.text = title ? title : document.querySelector('[name="title"]').value;
  $tabLink.href = url ? url : document.querySelector('[name="url"]').value;
  $tabLink.addEventListener('click', tabClick);
  $tabLink.addEventListener('dblclick', tabDblClick);
  var thisId = getNewId();
  $tabLink.setAttribute('id', 'tab-' + thisId);
  $tabLink.dataset['view'] = 'view-' + thisId;

  if (id)
    $tabLink.dataset.id = id;
  $tabList.appendChild($tabLink);

  var $view = createView($tabLink.href);
  $view.setAttribute('id', 'view-' + thisId);
  $viewList.appendChild($view);

  if (!checkActiveTab()) {
    $tabLink.classList.add('active');
    $view.classList.add('active');
  }

  if (newTab) {
    db.tabs.add({
      'title': $tabLink.text,
      'url': $tabLink.href
    }).then(function(id) {
      $tabLink.dataset.id = id;
    });
  }

  document.querySelector('.add-form').classList.add('hidden');

  return $tabLink;
};

var addNewClick = function(event) {
  event.preventDefault();

  addNewTab();
};

var showForm = function() {
  document.querySelector('.add-form').classList.remove('hidden');
};

document.querySelector('.add-button').addEventListener('click', addNewClick);

$addNew.addEventListener('click', showForm);

updateTabs();
