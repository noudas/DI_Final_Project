const {MongoClient} = require("mongodb")

async function main () {
    
    const url = `mongodb+srv://test:admin@clusterlearn.hopnx.mongodb.net/?retryWrites=true&w=majority&appName=ClusterLearn`;

    const client = new MongoClient(url);

    try {
        await client.connect();
        await listDatabases(client);
        // await createMultipleListings(client, [
        //     {
        //         name: "Infinite Views",
        //         summary: "Modern home with infinite views from the infinity pool",
        //         property_type: "House",
        //         bedrooms: 5,
        //         bathrooms: 4.5,
        //         beds: 5
        //     },
        //     {
        //         name: "Private room in London",
        //         property_type: "Apartment",
        //         bedrooms: 1,
        //         bathroom: 1
        //     },
        //     {
        //         name: "Beautiful Beach House",
        //         summary: "Enjoy relaxed beach living in this house with a private beach",
        //         bedrooms: 4,
        //         bathrooms: 2.5,
        //         beds: 7,
        //         last_review: new Date()
        //     }
        // ]);

        await findOneListingByName(client, "Ribeira Charming Duplex");

    } catch (error) {
        console.error(error)
    }
    finally{
        await client.close();
    }
}

async function createMultipleListings(client,newListings) {
    const result = await client.db("sample_airbnb").collection("listingsAndReviews").insertMany(newListings);
    console.log(`${result.insertedCount} new listings creted with the following ids:`);
    console.log(result.insertedIds);
}

async function createListing(client, newListing) {
    const result = await client.db("sample_airbnb").collection("listingsAndReviews").insertOne(newListing);
    console.log("Test id "+ result.insertedId);
    
}


async function listDatabases(client) {
    const databaseList = await client.db().admin().listDatabases();
    console.log("Databases");
    databaseList.databases.forEach(db => {
        console.log(db.name);
    });
}

async function findOneListingByName(client,nameofListing) {
    // client.db("sample_airbnb").collection("listingsAndReviews").findOne(); // Find all
    const result = await client.db("sample_airbnb").collection("listingsAndReviews").findOne({nameofListing}); // Find one
    if(result){
        console.log(`Found listing with the name ${nameofListing}`);
        console.log(result);
    } else {
        console.log(`No listing found`);
        
    }
}
main().catch(console.error());