const mysql = require('mysql');
const table_name = "user";

var pool = mysql.createPool({
    connectionLimit: 100,
    port: process.env.DB_PORT,
    host     : process.env.DB_HOST,
    user     : process.env.DB_USER,
    database: process.env.DB_NAME,
    password : process.env.DB_PASS
});


// View users
exports.view = (req,res) =>{

    pool.getConnection((err,connection)=>{
        if(err) throw err;
        console.log('Connected as ID '+ connection.threadId);

        connection.query(`select * from ${table_name} where status='active'`, (err,result,fields)=>{
            //When done with the connection, release it back to the pool
            connection.release();

            if(!err){
                let removedUser = req.query.removed;
                res.render('home', {result, removedUser});
            }
            else{
                console.log(err);
            }

            console.log('Inside home table: ',result);
        });
    });
}

// Just render the page to add a new user
exports.form = (req,res) =>{
    let mesg = null;
    res.render('add_user',{mesg});
}

// Post the values that is written in form and sent 
exports.postuser = (req,res) =>{
    const {first_name, last_name, email, phone, comments} = req.body;

    pool.getConnection((err,connection)=>{
        if(err) throw err;
        console.log('Connected as ID '+ connection.threadId);

        console.log(req.body);

        connection.query(`insert into ${table_name} values (NULL,'${first_name}','${last_name}','${email}','${phone}','${comments}',"active")`, (err,result,fields)=>{
            //When done with the connection, release it back to the pool
            connection.release();

            if(!err){
                console.log("User added successfully!");
                res.render('add_user',{mesg: `<strong>Success!</strong> The user was added successfully!`});
            }
            else{
                console.log(err);
            }
        });
    });
}

// Just render the page to edit a user
exports.edit = (req,res) =>{
    pool.getConnection((err,connection)=>{
        if(err) throw err;
        console.log('Connected as ID '+ connection.threadId);

        connection.query(`select * from ${table_name} where id= ?`,[req.params.id], (err,result,fields)=>{
            //When done with the connection, release it back to the pool
            connection.release();

            if(!err){
                res.render('edit_user', {result});
            }
            else{
                console.log(err);
            }

            console.log('Inside edit: ',result);
        });
    });
}


// Update User
exports.update = (req,res) =>{
    const {first_name, last_name, email, phone, comments} = req.body;

    pool.getConnection((err,connection)=>{
        if(err) throw err;
        console.log('Connected as ID '+ connection.threadId);

        connection.query(`update user SET first_name = ?,last_name = ?,email = ?,phone = ?,comments = ? WHERE id = ?`,[first_name, last_name,email,phone,comments,req.params.id], (err,result,fields)=>{
            //When done with the connection, release it back to the pool
            connection.release();

            if(!err){
                
                pool.getConnection((err,connection)=>{
                    if(err) throw err;
                    console.log('Connected as ID '+ connection.threadId);
            
                    connection.query(`select * from ${table_name} where id= ?`,[req.params.id], (err,result,fields)=>{
                        //When done with the connection, release it
                        connection.release();
            
                        if(!err){
                            res.render('edit_user', {result, mesg: `${first_name} ${last_name} has been updated`});
                        }
                        else{
                            console.log(err);
                        }
                    });
                });
            }
            else{
                console.log(err);
            }
            console.log('Inside update: ',result);
        });
    });
}

// Delete User 
exports.delete = (req,res) =>{
    pool.getConnection((err,connection)=>{
        if(err) throw err;
        console.log('Connected as ID '+ connection.threadId);

        connection.query(`UPDATE ${table_name} SET status = 'removed' WHERE id = ?`,[req.params.id], (err,result,fields)=>{
            //When done with the connection, release it back to the pool
            connection.release();

            if(!err){
                let removedUser = encodeURIComponent('User successfully removed.');
                res.redirect('/?removed=' + removedUser);
            }
            else{
                console.log(err);
            }

            console.log('Inside delete: ',result);
        });
    });
}

// View User
exports.viewuser = (req,res) =>{
    pool.getConnection((err,connection)=>{
        if(err) throw err;
        console.log('Connected as ID '+ connection.threadId);

        connection.query(`select * from ${table_name} where id=?`,[req.params.id], (err,result,fields)=>{
            //When done with the connection, release it back to the pool
            connection.release();

            if(!err){
                res.render('view_user',{user: result[0]});
            }
            else{
                console.log(err);
            }

            console.log('Inside View User: ',result);
        });
    });
}