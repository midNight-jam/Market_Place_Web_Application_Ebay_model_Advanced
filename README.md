    CMPE 273 - Lab 2
    Ebay Marketplace Application
    (Message oriented application using RabbitMQ)

Name : Jayam Malviya
Student Id : 011435567

Part 1: Ebay Marketplace Application

    Introduction
    
Goal : The Goal of the system is to provide a online web marketplace to its user for selling &
buying products. It also allows its user to sell their products either via direct selling or via the
bidding system. The users can sign up in the application & then login with their credentials to
use the system. The system also maintains the user's transactions which includes the user's
item bought or sold by the user, in addition to this system also keeps the users last logged in
time & it's displayed on the user's profile. System also has the cart functionality in which users
can add the items they want to buy and proceed to checkout for the payment processing.

    System Design

    Server Side :
● Each functionality is exposing its apis via the routes.

● For persistence we have used MongoDBl database. The database named is “ebayj”

● IN mongoDb we have collections as per the business entities like Users,
Advertisements, Bids and Transactions.

● For better optimization of load, we have implemented “Connection Pooling” to share the
pre-created connections. These pre created connections are kept in a stack and are
given to the in coming requests which require the mongodb connection for querying the
database. There is a queue implemented in the “ myMongo.js ” file, in which the requests
that require the connection are queued and a connection is allocated to them as & when
available. If all connections are busy then the request is pushed back into the queue,
where it waits until a connection is available to serve the request.

● Once the user is logged in, its session is maintained on the server. We have used
Passport npm module for this functionality.

● The application also takes care of password security & stores the user's password in an
encrypted format, converting the plaintext password into a HMAC code using SH1 hash
function with a static secret key. Then this encrypted format is stored in the database.

● User can add items to its cart and remove same. It can also reduce or increase the
quantity of products it want to buy. This cart is persisted and is maintained until user
checks out the cart or removes item from it.

● When user makes a purchase the system does validation on the credit card that is
entered, also while signing up, logging .

● After the purchase is made successfully the bought item is either reduced or removed
from the list of available items to be bought and the bought item is moved to the user's
transactions for him to view later.

● The bidding system maintains the maximum bid placed against the item and also the
bidder for that bid. After the bid ends that is 4 days, the highest bidder for the item wins
the bid. This won bids & his purchases can be viewed under transactions.


    Client Side :
● We have extensively used angular modules to keep our application a single page app.
There is only one index,ejs file that is downloaded to the client when he visits the
application url. Each module is created independently & the dependency among the
modules is injected as and when required.

● There are modules for each part of the application like header, signin, signup, products
list, bids, transactions , payment etc.

● For navigating between these modules we have used ng-route which renders the
component as per the url entered in the browser, however there is a check applied, if the
user is not logged in he is redirected towards the login page, if already logged in, the
user is greeted with the page.

● For the look & feel to be similar to “ebay” we have extensively used bootstrap css
classes in our application.

● We have also used Html5 controls such as number , date and email in our application.
Results: Screen captures

    Architecture of the RabbitMQ interaction:
Below are the points explaining the role and sequence of events, of client and server in
the AMQP setting.
1. The client (rpc client ) sends commands to the underlying amqp protocol to instantiate a
message queue with a unique queue name after this step the rabbit server subscribes has to
subscribe to this queue, with this subscription set up the rabbitmq server can easily listen up to
the requests that are published into the queue. But there is one part still pending , which is for
the client to subscribe to the response queue. This response queue is utilized by the rabbit
Server to publish the processed output, which the client has requested. That’s how we end up
having two queues one being the request queue and another being the response queue

2. After the first step we have underlying architecture ready for us to send and receive
messages. But we have still not identified who is going to be the producer for the request
queue. This is where our web application comes into play.The web application also known as
“producer” sends a message to RabbitMQ,using the queue that we have defined in the previous
step, and includes the data from the request, like name and email into the message payload.
This payload will contain the data required for the request processing, in addition to the payload
the client also pushes a callback function into the response queue which will be called when the
server has finished processing the request. But In Case the request took too long for receiving
the response we have to add a timeout function, which limits the upper bound that a request can
stay in the queue without receiving a response. If the timeout has expired the request will get
removed fromt the message queue and the final call back will be called with a timeout error.
There is one more important information that is inserted with the payload, to uniquely identify
each request a corrleation_id is generated which uniquely identifies each request.

3. With our housekeeping ready on both the ends it's time to publish the message into the
queue. After the Producer (client) has published a message in tot the queue, an exchange
receives the messages and routes them to correct message queues with the help of given
queue name. This exchange takes place within the RabbitMQ and the message is published
into the queue.

4.Now the request has arrived at the consumer end of the requets queue, which is the rabbitMq
server. From here server read the message payload and calls a service which will perform the
processing and generate a result. The service actually holds the business logic and also the
reference for database, it is the only layer which will hold the reference to the database as it is
the only place where the business logic resides. After the service has executed it gives back the
response to the rabbit server, which then calls the response callback from the response queue
with passing the result as parameter. It fetches the callback from response queue based on the
correlation id of the request that it is processing right now.

1. Explain what performance change RabbitMQ provides? Elaborate on the results of
throughput with and without using RabbitMQ. If you find any increase/decrease in the
throughput, explain the reason for the same.

Ans: As we can observe from the recorded performance of our application with using
RabbitMQ, that we have achieved greater throughput for our application. As compared to our
previous architecture where we had no concept of producer and consumer, there was only one
server which had to manage every request from start to end. In our new architecture we can
have multiple producers and consumers to handle operations. To give an example, we can have
one producer dedicated for lets say login request. Our login route client can be the producer and
we can have multiple consumer on the rabbitmq server side, which are subscribed to the login
queue. Now when a bunch of login requests arrive we can have our consumers serving all these
login request in parallel. This ability to have many consumers work along each side, gives us a
tremendous performance boost. And it is also visible in the performance comparison graphs.
Similar thing can be done on the rabbitmq server side as well, rather than having only single
consumers on the response queue, we can have multiple consumers subscribed to the
response queue. In this way any available consumer can take the response and forward the
response. With this configuration we have gained a greater throughput in our application.

2. Compare passport authentication process with the authentication process used in Lab1.

Ans : One advantage we observed of using passport for authentication was it provided a neat
way to plugin in various types of authentication strategies in our code. The concept of strategies
gives us a separation of concern in design. This concept of using multiple strategies for
authentication is a definitely a big win over our traditional authentication method. Another
advantage that we observed which is in couple with the nosql MongoDb that we have used. On
successful authentication, as passport is coupled with “mongo-store” it will automatically create
a new collection named “Sessions” with in the current database. And will populate with the
current user object associated with the request. We can define what objects we want to serialize
upon the successful authentication of the request. Once the user object is serialized into
Session collection, we can utilize these objects for checking if the request is already
authenticated or not. Upon the request from the same user the user object is automatically
deserialized for the corresponding request. As compared to the previous method where we
have to keep the user's details in the client-session object. Passport authentication act as a
interceptor in between and proceeds the request attaching the authentication result to the next
function, which is an ideal modelling of the authentication layer within the business. Also we can
add more strategies as config to our passport, this will help us in enabling our application to
utilize oauth and use social media passport strategies to provide an ability for user to login with
their social media accounts.

3. If given an option to implement MySQL and MongoDB both in your application, specify which
data of the applications will you store in MongoDB and MySQL respectively.

Ans : In my opinion the major advantage of NoSql Db over Relational Db is the improved read
and write performance. As unstructured data is allowed we can have diverse objects within the
same collection, this enables us to store the information related to the entity to be stored just
alongside with the object. Also Nosql is very ideal to store the data that is not going to get
update once written,some examples of data that falls under such category are the History of
transactions that the user has had in past, purchases, bids won, sold items, Reviews of the
products or items etc. Also we can horizontally scale the mongodb with sharding and distribute
the database to multiple nodes. This feature is not possible with Mysql, because it can only
scale up vertically, means we can only increase the strength of a single instance of the
database machine. Apart from this Mysql relational database is ideal for transaction processing,
in our project it would be a good fit for the bidding system, where we have to keep updating the
bids depending upon the the bid amount or if the bid duration is over. Also Mysql allows us to
link information across tables through the use of Foreign keys, another ideal place to benefit
from this ability would be the shopping cart functionality, where we have to maintain if the
product is added in the cart and if so then we keep a reference of the original product in the cart,
so that we don't necessarily commit the product to the customer before him buying the product.
Also to maintain the last logging activity of the users Mysql is an ideal choice.