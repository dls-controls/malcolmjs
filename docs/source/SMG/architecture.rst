.. _architecture_:

Architecture
============

Context
-------

`Malcolm <http://pymalcolm.readthedocs.io/en/latest/>`_ provides a higher level abstraction over EPICS for monitoring and controlling devices (e.g. motor controllers or area detectors). **MalcolmJS** is a user interface for Malcolm that allows blocks to be wired together and more complex behaviours to be programmed into the hardware (e.g. custom scan patterns).

.. figure:: architecture_diagrams/malcolmjs_context.draw-io.svg
    :align: center

    MalcolmJS context within its wider environment



The overall use case for MalcolmJS is that engineers will be using it to configure PANDA boxes from a laptop, this will involve wiring blocks together, tweaking inputs and monitoring outputs. This may involve working with physical hardware so as much information needs to be available on the screen as possible whilst minimising scrolling (this helps to reduce context switching).

The other minor use case is to allow engineers to view block attributes on their phone, this will allow them to monitor outputs and tweak inputs without having to go back to their laptop.

Containers
----------

The container view for MalcolmJS breaks down in to the main user interface categories as well as the interface for interacting with Malcolm.

.. figure:: architecture_diagrams/malcolmjs_containers.draw-io.svg
    :align: center

    MalcolmJS container view

**Malcolm Interface:-**
The malcolm interface will allow MalcolmJS to be decoupled from Malcolm by isolating the code that interacts with the socket layer. This will also be the point at which we can integrate the Malcolm information with the Redux state that can be used by the presentation components.

The secondary reason for doing this is so that the Malcolm related code could be released as a library for others to create their own React dashboards from Malcolm data.

**Block Pane:-**
This presentational layer container will contain all the React components for displays information about the details for a block, i.e. information about the attributes it has. There will be quite a large collection of components in here for the various attributes, e.g. number inputs, LED status, combo selections, etc. The attributes will roughly break down into summary information, parameters, views and methods.

**View Pane:-**
When the user selects a view options, e.g. layout, table, etc. from the block pane then MalcolmJS will populate a central panel with the details about that view. For example, if they select layout then they will get a flow diagram showing the various blocks that are currently connected.

**Navigation:-**
The navigation container has all the presentational components for showing how far down the block tree a user is and allow them to select different levels as well as different views easily from one place.

**Attribute Tracking:-**
Currently there is no functionality in Malcolm to track the history of a numeric attribute over time, therefore to display a graph of that attribute we need to track its values over the time that the browser is open.

**Connection Monitoring:-**
Malcolm works on a subscribe/unsubscribe model - in order to clean up connections we need to have sufficient monitoring. This will also making it easier to have a status indicator for connections as well as handling connection errors.

One of the best ways to think about the high level structure for MalcolmJS is to consider the high level user interface mock ups. They show the main sections of the interface and thus how the application breaks down into containers.

.. figure:: architecture_diagrams/malcolmjs_desktop_mockup.draw-io.svg
    :align: center

    MalcolmJS desktop view


The user interface breaks down in to three main components:

- the parent block (the left panel)
- the layout view (the central panel)
- the child block (the right panel)

Users typically navigate to a top level block and then navigate down the block structure depending on their needs. They can change the view in the middle panel for any that are available in the parents block details panel in the views section.

Once they click on a block in the central panel then it will display information about that child block in the right hand panel. This information will include attributes, and may additionally include views and methods of its own. If the user clicks on the view button for the child's layout attribute then the contents of the child panel become the contents of the parent panel and the user can navigate one more level down the tree.

On a multi-monitor system it can be useful to keep track of block details for various blocks in the tree, this is why there is a pop-out button. The user can choose to show the attributes for a particular block in a standalone window. It it worth noting that this is also what the mobile view would display.


.. figure:: architecture_diagrams/malcolmjs_phone_mockup.draw-io.svg
    :align: center

    MalcolmJS mobile view

The mobile view is simply intended to give engineers a quick view on the information being output from devices whilst adjusting them, it is not meant to be a full MalcolmJS environment. Never-the-less, they can click on an attribute for more information and it will close the draw for the attributes and show graphs/tables/etc. in the central panel just like the desktop version.

Components
----------

.. figure:: architecture_diagrams/malcolmjs_components.draw-io.svg
    :align: center

    MalcolmJS component view

- **Malcolm Interface**
    The Malcolm Interface consists of all the parts needed to integrate it in to the Redux lifecycle. It is better described by the diagram below:

    .. figure:: architecture_diagrams/malcolmjs_redux_integration.draw-io.svg
        :align: center

        Malcolm redux integration

    By ensuring that components need to create actions using the Malcolm Action Creators and processing data through the Malcolm reducer ensures there is a consistent data model for components to use. Messages intended for the socket are intercepted in the middleware and responses from the socket are injected back into the cycle as a new action in the Malcolm Socket handlers.

- **Attribute Details**
    All of the information for rendering the MalcolmJS interface is returned as part of the websocket response, part of the metadata describes the widget to show for the attribute in question. This means that we are going to need a collection of components to represent these widgets, e.g. a numerical label, an LED indicator, etc.

    The attributes break down in to three main areas; parameters, views and methods. Views contain buttons to populate the central panel with information about that view, e.g. the layout, a table of information, etc. The method components lists the methods on the block and allows the user to click on a button to call them as well as displaying what other inputs from the block are used.

- **View Details**
    The view details provides more information about the parent block being viewed, while there are component and table views, the main view is the layout view. The layout view shows how the current block is wired to child blocks, it allows new connections to be made, and allows a user to add new child blocks.

    The user can drag blocks around in the layout view as well as connect output ports to input ports.


Deployment View
---------------

The primary deployment scenario is where MalcolmJS is packaged up with Malcolm and served from a web server inside Malcolm on the same PANDA box. The websocket connection is to the same server, so there should be no cross-origin issues. During development we'll introduce a proxy when connecting to a test instance.

.. figure:: architecture_diagrams/malcolmjs_deployment.draw-io.svg
    :align: center

    Serving MalcolmJS from the same server as Malcolm


Technologies
------------

The technology stack selection has been based on the principles of:

- Making use of **Open Source Software**
- Selecting modern, well supported frameworks to ensure long term sustainability (within the bounds of the previous principle)
- Fitting in with Diamond processes where there are clearly defined technology choices for consistency

By Component
~~~~~~~~~~~~

- **MalcolmJS redux components**
    A set of components for handling socket communication with Malcolm that intercepts messages intended for Malcolm and sends them, as well as injecting responses back into the Redux one-way data flow. 
- **MalcolmJS attribute components** 
    A set of presentation only react components that could be distributed as an npm package for other people to develop MalcolmJS dashboards with.
- **Remaining MalcolmJS presentation components** 
    The other container components needed to layout the MalcolmJS site and wire the presentational compoenents up to the MalcolmJS redux components.

Tools
~~~~~

- Create React App for the initial site template
- Jest unit testing and coverage
- Cypress end-to-end testing
- React Storybook
- React Storybook Info addon
- ESLint with the AirBnB rule set
- Prettier code styling
- Husky for pre-commit hooks
- Travis for continuous integration
- Github releases for uploading build artifacts back to Github
- Waffle.io for Agile tracking
- Codecov for tracking code coverage
- Github for version control and issue management
- Sphinx for document building

Languages
~~~~~~~~~

- Javascript
- reStructuredText
- bash
- yaml

Frameworks
~~~~~~~~~~

- React
- Redux
- React-Router
- Redux-thunk
- Socket.io
- Material UI


Quality
-------

Coding Standards
~~~~~~~~~~~~~~~~

Static code analysis is done by running ESLint against the code with the `AirBnB rule set <http://airbnb.io/javascript/>`_. Code styling is done with `Prettier <https://prettier.io/>`_ to avoid debates on code styling. These are both enforced as pre-commit hooks with the ``--fix`` option turned on so as much as possible is automatically fixed. This ensures the static code analysis violations remain at zero unless explicitly ignored.

Unit testing is all done with Jest which provides code coverage information using the ``--coverage`` flag, this generates an LCOV report with all the coverage information. The coverage information is tracked on CodeCov, where during this phase of development, all the information is on the `version 1 branch <https://codecov.io/gh/dls-controls/malcolmjs/branch/version1>`_.

.. figure:: images/coverage-chart.png
    :align: center

    Unit test coverage for the last 6 months on branch ``version1``


All code including documentation should be peer-reviewed, as such all work must be done on a branch and a pull request created in order to review the code before merging into the main branch (during this phase of the project it is ``version1``).

Branches should use the naming convention ``feature/{descriptive name}-#{issue number}``. By adding the issue number to the end it allows the waffle.io integrations to automatically move cards on the agile boards when particular activities are in progress/completed.

When creating a pull request you should also add the comment
::

    connect to #{issue number}

to the description to link the pull request to the issue.

Pull requests are gated so the automated build in Travis needs to succeed and the reviewer should also take note of the impact on code coverage. The aim is to maintain a high level of coverage (e.g. over 90% is good) but whilst being pragmatic, it is not an exercise in getting a high number but rather making sure the new code is sufficiently tested for maintainability.

Security
~~~~~~~~

There are no current security restrictions on MalcolmJS as it has to be able to communicate with a Malcolm enabled device which are all inside the Diamond internal network and so MalcolmJS will also have to be accessed from inside the network. Once inside the network anyone is allowed the configure the Malcolm settings.

Testing
~~~~~~~

As much effort as possible should be made to automate unit, integration and system testing. MalcolmJS will use as much unit testing as possible, as well as running end-to-end tests against a test server that mimics the socket responses. This should mean very few system tests are needed as we can expand the socket responses of the test server to cover these cases. Where system tests are needed then they will need to be done manually as they will need to be run against an actual PANDA box but could still be based off scripted tests (e.g. using cypress).

Given we are developing a website, usability testing will also be important so we should plan to get some engineers to do some testing and gather their feedback.

One of the big issues with versions prior to version 1 was performance and the time taken to re-render updates. We should also put additional effort into performance testing to make sure the page is at least usable (i.e. it doesn't need to be lightning fast but shouldn't freeze up, it should at least indicate to the user it is still responding but could be waiting for a response).

Attitude Towards Bugs and Technical Debt
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

Bugs severely affect the maintainability of the system, as far as is practical we should seek to have a zero bug system - this means that when a bug is identified then it gets prioritised to the top of the backlog and dealt with as soon as possible.

This approach should ensure that the number of bugs doesn't become un-manageable and then ignored because they seem unsolvable.

The same approach should be employed with technical debt, we should seek to minimise technical debt so the system is more maintainable. This should allow us to develop faster because we aren't weaving new features into an existing fragile system. The one caveat with this is that a level of pragmatism needs to be taken depending on the timescales and progress needed for the project, but remembering that every un-addressed issue will slow the project down at some point in the future.
