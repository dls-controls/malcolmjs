.. _glossary:

.. ##########
.. links to external PandA related documentation
.. ##########

.. _PandABlocks-FPGA: https://pandablocks-fpga.readthedocs.io/en/autogen/index.html
.. _malcolm: https://pandablocks-fpga.readthedocs.io/en/autogen/index.html


Glossary
========

.. _attribute_:

Attribute
---------

A property of a `block_` that influences behaviour within the purpose of that Block. 

Attributes are further divided into:

    * Those that can be modified dynamically during an execution process - a `writeable_attribute_`.
    * Those that once configured in the `design_` cannot be changed during execution - an `immutable_attribute_`. 


.. _attribute_group_:

Attribute Group
---------------

A logically grouping of related `attributes <attribute>` within a `block_`.


.. _block_: 

Block
-----

The graphical manifestation of a component within a `design_`, encapsulating its attributes, methods and connectivity to other blocks.

Blocks may represent, for example:

    * Input and output controllers (interfaces to the FPGA).
    * Configurable clocks.
    * Logic lookup tables and logic gates.

A full list of supported blocks, together with their attribute specifications is available from the `PandABlocks-FPGA`_ documentation.


.. _Block_information_panel_:

Block Information Panel
-----------------------

Panel displayed within the user inferface containing details of the `attributes <attribute_>` and `methods <method_>` associated with the currently selected `block_` within the `layout_`.


.. _child_block_:

Child Block
-----------

A `block_` within an assemblage of connected blocks that when aggregated deliver the capability of a larger `Parent Block <parent_block_>`. 

A Child Block may itself represent a Parent Block if its own functionality can be further decomposed. 


.. _connector_:

Connector
---------

The mechanism of transferring content from a `source_port_` in one `block_` to a `sink_port_` in a second Block.  Connections can only be made between ports of the same logical type (e.g. Boolean -> Boolean, int32 -> int32). 


.. _design_:

Design
------

The technical definition of the implemented system describing the `blocks <block_>` it contains, their `attributes <attribute_>` and the `connections <connector_>` between them.

Designs are presented graphically as a `layout_` within the 'Layout Panel' on the web interface allowing a user to build, configure and manage the system represented by that Design.


.. _dynamic_attribute_:

Dynamic Attribute
-------------------

*I PREFER THIS TERM TO 'WRITEABLE ATTRIBUTE' UNLESS THERE IS AN EXISTING NAMING CONVENTION*

Synonym for `writeable_attribute_`.  cf. `immutable_attribute_`.


.. _method_:

Method
------

Defines an **action** that can be performed by a `block_` in support of the purpose of that block.


.. _immutable_attribute_:

Immutable Attribute
-------------------

A `block_` attribute whose value, once set, *cannot* be modified during an execution process.  cf. `writeable_attribute_`.


.. _input_port_:

Input Port
----------

Synonym for `sink_port_`.



.. _layout_:

Layout
------

The graphical representation of a `design_` within the web interface showing the `blocks <block_>` within the Design and the `connections <connector_>` between them based on the selected `root_node_`.


.. _output_port_:

Output Port
-----------

Synonym for `source_port_`.



.. _parent_block_:

Parent Block
------------

A `block_` aggregating one-or-more `Child Blocks <child_block_>` each performing an action or activity in support of its parent's functionality.  

Parent blocks, together with their attributes and methods are always presented in the left-hand panel of the web interface when open in Layout View.


.. _root_node_:

Root Node
---------

The outermost entity containing the `layout_` presented within the user inferface.  If the higest level Root Node is selected this encapulates the entire `design_`, otherwise the Root Node represents a configured `block_` within that Design.  The selected Block may itself be a `parent_block_` or a `child_block_`. 


.. _source_port_:

Source Port
-----------

A port on a `block_` responsible for transmitting data generated within that Block.  

Every Source Port within a Block has a pre-defined type as described in the Block specification.  For details of individual Blocks see `PandABlocks-FPGA`_.  


.. _sink_port_:

Sink Port
----------

A port on a `block_` responsible for accepting data for utilisation within that Block.  

Every Sink Port within a Block has a pre-defined type as described in the Block specification.  For details of individual Blocks see `PandABlocks-FPGA`_.  


**Top Level Block**

blah


.. _writeable_attribute_:

Writable Attribute
------------------

A `block_` attribute whose value can be modified by the behaviour of the Block with which it is associated, or by pre-cursor activity within other blocks in the `design_`, during an execution process.  cf. `immutable_attribute_`.

