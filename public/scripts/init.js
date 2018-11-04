document.addEventListener('DOMContentLoaded', function() {
    var modals = M.Modal.init(document.querySelectorAll('.modal'), null);

    M.Sidenav.init(document.querySelectorAll('.sidenav'), null);

    M.Collapsible.init(document.querySelector('.collapsible.expandable'), {
        accordion: false
    });

    var dropdowns = document.querySelectorAll('.dropdown-trigger');
    M.Dropdown.init(dropdowns, null);
    // prevent that collapsible opens when user click on the dropdown
    dropdowns.forEach(function (dropdown) {
      dropdown.addEventListener('click', function (event) {
        event.stopPropagation();
      });
    });

    var dropdownLinks = document.querySelectorAll('.not-collapse');
    dropdownLinks.forEach(function (dropdownLink) {
      dropdownLink.addEventListener('click', function (event) {
        event.stopPropagation();
        // open modal with stop propagation
        modals.forEach(function (modal) {
          if ('#' + modal.id == dropdownLink.getAttribute('href')) {
            modal.open();
          }
        });
      });
    });
});