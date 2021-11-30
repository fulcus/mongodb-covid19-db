# mongodb-covid19-db

### Purpose
The first project's goal is to trace contacts between people, to monitor the viral diffusion.
It entails the design and implementation of a document-based NoSQL database to support a contact tracing application for COVID-19. 
The data are fake and generated with [mockaroo](https://www.mockaroo.com/) and python scripts.

### Installation

To run the project follow these simple example steps.

1. Install [mongodb](https://www.mongodb.com/try/download)
1. Import [dump](https://github.com/fulcus/mongodb-covid19-db/blob/master/mongodb/mongodb-SMBUD.dump)
1. Visit the [demo page](https://fulcus.github.io/mongodb-covid19-db/mongodb/ui/index.html) or launch `mongodb/ui/index.html`

### Features

* Database design
* Database creation using [mockaroo](https://www.mockaroo.com/) and python (see folder script)
* Created queries and commands to use on our database
* Implemented UI to visualize data

The full documentation is available [here](https://github.com/fulcus/mongodb-covid19-db/blob/master/neo4j/docs/Report.pdf).

### ER diagram

<img src="mongodb/images/ER.jpeg" width="750"/>

### User Interface 

#### Dashboard

The commands on the sidebar offer an intuitive to add, remove or modify nodes, whereas the cypher query section lets users run any advanced query or command.

<img src="mongodb/images/dashboard.png" width="750"/>

#### Query 3

We implemented 5 useful queries available in the sidebar. Below the visualization of Query 3.

<img src="mongodb/images/q3.png" width="550"/>

### Built with

* [mongodb](https://www.mongodb.com)
* [mockaroo](https://www.mockaroo.com/)

## Authors
* [Alice Brugnoli](https://github.com/alicebrugnoli)
* [Leonardo Caponi](https://github.com/leo-capo)
* [Andrea Ceresetti](https://github.com/andreaceresetti)
* [Francesco Gonzales](https://github.com/fulcus)
* [Ginevra Iorio](https://github.com/ginevraiorioo)
