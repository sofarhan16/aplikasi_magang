var Crypto = require('crypto');
var moment = require('moment');
const conn = require('../database');
var fs = require('fs');
const transporter = require('../helpers/emailSender');
var { uploader } = require('../helpers/uploader');

module.exports = {
    register: (req,res) => {
        
        var { username, password, email, phone } = req.body;
       
        var sql = `SELECT username FROM users WHERE username="${username}" or email="${email}"`;
        conn.query(sql, (err, result) =>{
            if(err) {
                throw err;
            }

            if(result.length > 0){
                res.send({status: "error", message: "Username or email has been taken!"})
            } else {
                const hashPassword = Crypto.createHmac('sha256', "abcd123")
                            .update(password).digest('hex');
                var dataUser = { 
                    username,
                    password: hashPassword,
                    email,
                    phone,
                    role: 'User',
                    status: 'Unverified',
                    lastlogin: new Date() 
                }
                sql = `INSERT INTO users SET ?`;
                conn.query(sql, dataUser, (err1, result1) => {
                    if(err1){
                        throw err1;
                    }else{
                        console.log('Success!')
                        res.send({id: result1.insertId,username, email, role: 'User', status: 'Unverified', token:''})
                    }
                    
                        
                })
               
            }
        })
    },
    signin: (req,res) => {

        var { username, password } = req.body;
    
        const hashPassword = Crypto.createHmac('sha256', "abcd123")
        .update(`${password}`).digest('hex');
       
        var sql = `SELECT * FROM users WHERE username = '${username}' AND password = '${hashPassword}';`;
        conn.query(sql, (err, result) => {
            if(err) throw err;
            var updateLogin = {
                lastlogin: new Date()
            }
            var sql2 = `UPDATE users SET ? WHERE username='${username}';`;
            conn.query(sql2, updateLogin, (err, result2) => {
                if (err) throw err;
                console.log(result2);
            }) 

            res.send(result);
            // return res.status(500).json({ error: false}); 
        })
       
    },
    keeplogin: (req,res) => {

        var { username } = req.body;
       
        var sql = `SELECT * FROM users WHERE username = '${username}';`;
        conn.query(sql, (err, result) => {
            if(err) throw err;
            res.send(result);
        })
       
    },
    verified: (req,res) => {
        var { username, password } = req.body;
        
        var sql = `SELECT * FROM users WHERE
                    username='${username}' AND
                    password='${password}';`;
        
        conn.query(sql, (err, result) => {
            if(err) throw err;
            if(result.length > 0){
                sql = `UPDATE users SET status='Verified' WHERE id=${result[0].id};`;
                conn.query(sql, (err1,result1) => {
                    if(err1) throw err1;
                    
                    res.send({
                        username, 
                        email: result[0].email,
                        role: result[0].role,
                        status: 'Verified'})
                })
            } else {
                throw 'User Not Exist';
            }
        })
        
    },
    registerEmailPromo: (req,res) => {
        
        var { email,name } = req.body;
        console.log(email,name)
        var mailOptions = {
            from: 'No Reply <warehousenesiaindo@gmail.com>',
            to : 'warehousenesia.id@gmail.com',
            subject : 'pendaftaran email user',
            html: `Email ${email} dengan pemilik email yang bernama ${name} telah mendaftar kan di list promo \n konfirmasikan segera ke email tersebut mengenai kode discount`
        }

        transporter.sendMail(mailOptions, (err2, res2) => {
            if(err2){
                console.log(err2);
               
            } else {
               
                res.send("sukses");
            }
        })

    },
    getAgentList : (req,res) => {
        var sql = `SELECT 
        a.id_agent,
        a.fullname,
        u.username,
        u.email,
        u.phone,
        u.lastmember,
        a.companyName,
        u.level
        FROM users u 
        left join agentCompany a on a.id_agent = u.id
        where u.level != '';`;
        console.log(sql)
        conn.query(sql, (err, result) => {
            if(err) throw err;
            console.log(result)
            res.send(result);
        })
       
    },
    daftaragent: (req, res) => {
        var data = {
            id_agent:req.body.id_agent,
            bank:req.body.bank,
            total:req.body.total
        }
         var sql = `INSERT INTO daftar_agent SET ?;`;
         conn.query(sql, data,(err, result) => {
             if(err) throw err;
             res.send(result);
         })
     },

     allPaymentAgent:(req, res)=> {

        var sql = `SELECT id_transaksi as transaksi FROM paymentagent`
        conn.query(sql, (err, result) => {
            if(err) throw err;
            
            res.send(result)

        })

     },

     getdaftarinfo : (req,res) => {
         var sql = `SELECT 
         da.id as id,
         n.nama_bank as nama_bank,
         n.noRek as noRek,
         da.total as total,
         p.waktu,
         p.status as status_agent
         FROM daftar_agent da 
         JOIN noRek n on n.id=da.bank
         LEFT JOIN paymentagent p on p.id_transaksi = da.id
         where da.id_agent = ${req.params.id_agent};`;
         console.log(sql)
         conn.query(sql, (err, result) => {
             if(err) throw err;
             console.log(result)
             res.send(result);
         })
        
     },
     addagentdata: (req, res) => {
        var data ={
            id_agent:req.body.id_agent,
            fullname:req.body.fullname,
            companyName:req.body.companyName,
            address:req.body.address,
            Provinsi:req.body.Provinsi,
            kota:req.body.kota,
            kodepos:req.body.kodepos
        }
         var sql = `INSERT INTO agentCompany SET ?;`;
         conn.query(sql, data,(err, result) => {
             if(err) throw err;
             res.send(result);
         })
     },
     getagentstoredata : (req,res) => {
        var sql = `SELECT *
        FROM agentCompany
        where id_agent = ${req.params.id_agent};`;
        console.log(sql)
        conn.query(sql, (err, result) => {
            if(err) throw err;
            console.log(result)
            res.send(result);
        })
       
    },
    getagentregisterdata : (req,res) => {
        var sql = `SELECT 
        a.id_agent,
        a.fullname,
        u.email,
        u.phone,
        a.companyName,
        p.id_transaksi,
        p.status,
        p.waktu,
        p.image,
        da.total
        FROM agentCompany a
        join daftar_agent da on a.id_agent = da.id_agent
        join users u on a.id_agent = u.id
        join paymentagent p on p.id_agent = a.id_agent
        where p.status = 'sudah dibayar'
        and u.level is null
        or u.level = ''`;
        console.log(sql)
        conn.query(sql, (err, result) => {
            if(err) throw err;
            console.log(result)
            res.send(result);
        })
 
    },
    updatelevel : (req,res) => {
        var id = req.body.id;
        var level=req.body.level;
        var lastmember = new Date();
        if(level == 'SILVER' || level == 'BRONZE'){
            lastmember.setMonth( lastmember.getMonth()+1)
            var limit = 5000000;
        }else{
            lastmember.setMonth( lastmember.getMonth()+12)
            var limit = null;
        }
        var updateAgent ={
            level,
            lastmember,
            status:"Verified",
            limit
        }
        var sql = `UPDATE users SET ? WHERE id=${id};`;
        console.log(sql)
        conn.query(sql,updateAgent,(err, result) => {
            if(err) throw err;
            res.send(result);
        })
       
    },
    updatelimit : (req,res) => {
        var id = req.body.id_agent;
        var limit=req.body.limit;
        var level=req.body.level;
        if(level == 'SILVER' || level == 'BRONZE'){
            var updateAgent ={
                limit
                
            }
            var sql = `UPDATE users SET ? WHERE id=${id};`;
            console.log(sql)
            conn.query(sql,updateAgent,(err, result) => {
                if(err) throw err;
                res.send(result);
            })
        }
        
       
    },
    deletemember : (req,res) => {
        var username = req.body.username;
        var sql = `UPDATE users SET level = NULL WHERE username='${username}';`;
        conn.query(sql,(err, result) => {
            if(err) throw err;
            res.send(result);
        })
       
    }, 
    addbank: (req, res) => {
        
        
        try {
            const path = '/images/bank'; //file save path
            const upload = uploader(path, 'BNK').fields([{ name: 'gambar'}]); //uploader(path, 'default prefix')
    
            upload(req, res, (err) => {
                if(err){
                    return res.status(500).json({ message: 'Upload picture failed !', error: err.message });
                }
    
                const { gambar } = req.files;
                
                const imagePath = gambar ? path + '/' + gambar[0].filename : null;
                //req.body.data.input_date = new Date();
                const data = JSON.parse(req.body.data);
                
                data.gambar = imagePath;                
                
                var sql = 'INSERT INTO noRek SET ?';
                conn.query(sql, data, (err, results) => {
                    console.log(data)
                    if(err) {
                        console.log(err.message)
                        fs.unlinkSync('./public' + imagePath);
                        return res.status(500).json({ message: "There's an error on the server. Please contact the administrator.", error: err.message });
                    }  

                    sql = 'SELECT * from noRek;';
                    conn.query(sql, (err, results) => {
                        if(err) {
                            console.log(err.message);
                            return res.status(500).json({ message: "There's an error on the server. Please contact the administrator.", error: err.message });
                        }
                        console.log(results);
                        
                        res.send(results);
                    })
                   
                })    
            })
        } catch(err) {
            return res.status(500).json({ message: "There's an error on the server. Please contact the administrator.", error: err.message });
        }
     },

     

     updatebank : (req ,res) => {
            try {
                var id = req.params.id;
                const path = '/images/bank'; //file save path
                const upload = uploader(path, 'BNK').fields([{ name: 'gambar'}]); //uploader(path, 'default prefix')
        
                upload(req, res, (err) => {
                    if(err){
                        return res.status(500).json({ message: 'Upload picture failed !', error: err.message });
                    }
        
                    const { gambar } = req.files;
                    
                    const imagePath = gambar ? path + '/' + gambar[0].filename : null;
                    //req.body.data.input_date = new Date();
                    const data = JSON.parse(req.body.data);
                    
                    data.gambar = imagePath;                
                    
                    var sql = `UPDATE noRek SET ? WHERE id=${id};`;
                    conn.query(sql, data, (err, results) => {
                        console.log(data)
                        if(err) {
                            console.log(err.message)
                            fs.unlinkSync('./public' + imagePath);
                            return res.status(500).json({ message: "There's an error on the server. Please contact the administrator.", error: err.message });
                        }  
    
                        sql = 'SELECT * from noRek;';
                        conn.query(sql, (err, results) => {
                            if(err) {
                                console.log(err.message);
                                return res.status(500).json({ message: "There's an error on the server. Please contact the administrator.", error: err.message });
                            }
                            console.log(results);
                            
                            res.send(results);
                        })
                       
                    })    
                })
            } catch(err) {
                return res.status(500).json({ message: "There's an error on the server. Please contact the administrator.", error: err.message });
            }

        
    },
    forgetuser: (req,res) => {
        var { email } = req.body;
       
        var sql = `SELECT * FROM users WHERE email = '${email}';`;
        conn.query(sql, (err, result) => {
            if(err) throw err;
            res.send(result);
        })
       
    },
    resetpassword: (req,res) => {
        var{id,email,username}= req.body
       
        var linkVerifikasi = `http://warehousenesia.id/reset?username=${username}&email=${email}&id=${id}`;
                    var mailOptions = {
                        from: 'No Reply <warehousenesiaindo@gmail.com>',
                        to : email,
                        subject : 'Reset password',
                        html: `Please click the following link to reset the password: <a href="${linkVerifikasi}">Reset password</a>`
                    }

                    transporter.sendMail(mailOptions, (err2, res2) => {
                        if(err2){
                            console.log(err2);
                            // res.send({status: 'Error!', message: 'Error sending message'})
                            throw res2;
                        } else {
                            console.log('Success!')
                            res.send({username, email, role: 'User', status: 'Unverified', token:''})
                        }
                    })
       
    },
    changepassword : (req,res) => {
        var{id,password}= req.body
        const hashPassword = Crypto.createHmac('sha256', "abcd123")
        .update(password).digest('hex');
            var UpdatePass ={
                password:hashPassword
            }
            var sql = `UPDATE users SET ? WHERE id=${id};`;
            console.log(sql)
            conn.query(sql,UpdatePass,(err, result) => {
                if(err) throw err;
                res.send(result);
            })
    },
    
    editProfile: (req, res) => {

        try {
            var id = req.params.id;
            const path = '/images/bank'; //file save path
            const upload = uploader(path, 'PRF').fields([{ name: 'gambar'}]); //uploader(path, 'default prefix')
    
            upload(req, res, (err) => {
                if(err){
                    return res.status(500).json({ message: 'Upload picture failed !', error: err.message });
                }
    
                const { gambar } = req.files;
                const imagePath = gambar ? path + '/' + gambar[0].filename : null;                
                const data = JSON.parse(req.body.data);                
                data.gambar = imagePath;                
                
                const kotak = JSON.parse(req.body.kotak);                

                var sql = `UPDATE users SET ? WHERE id=${id};`;
                conn.query(sql, data, (err, results) => {
                    
                 var sqlp = `UPDATE agentcompany SET ? WHERE id_agent = ${id}`
                 conn.query(sqlp, kotak, (err, result2) => {

                        if(err) throw err
                    })

                    console.log(data)
                    if(err) {
                        console.log(err.message)
                        fs.unlinkSync('./public' + imagePath);
                        return res.status(500).json({ message: "There's an error on the server. Please contact the administrator.", error: err.message });
                    }  
                    res.send(results)
                })    
            })
        } catch(err) {
            return res.status(500).json({ message: "There's an error on the server. Please contact the administrator.", error: err.message });
        }


    },

    getUserEdit: (req, res) => {

        var sql = `SELECT * FROM users u 
        LEFT JOIN agentCompany a on a.id_agent = u.id
        WHERE u.id = ${req.params.id_user}`

        conn.query(sql, (err, result) => {

            if(err) throw err

            res.send(result)

        })


    },

    pembatalan: (req, res) => {

        var { id } = req.body

        var sql = `DELETE FROM daftar_agent WHERE id = ${id}`

        conn.query(sql, (err, result) => {

            if(err) throw err
            res.send(result)

        })
        
    },


    getPayment: (req, res) => {

        var sql = `SELECT * FROM daftar_agent WHERE id_agent = ${req.params.id_user}`

        conn.query(sql, (err, result) => {

            if(err) throw err
            res.send(result)

        })

    }

}
      