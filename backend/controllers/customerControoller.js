const conn = require('../database');
var fs = require('fs');
var { uploader } = require('../helpers/uploader');

module.exports = {
    searchcustomer: (req,res) => {
        var { keyword = ""} = req.body;

        var splitString = (strSearch) => {
            var result = strSearch.split(' ');
            return result;
        }
        var resKeyword = splitString(keyword).join('|');
        console.log(resKeyword);
        if(resKeyword == "") {resKeyword = "|"}
       
        var sql = `SELECT * FROM customers WHERE nama_lengkap = '${resKeyword}'`;
        conn.query(sql, (err, result) => {
            if(err) throw err;
            console.log(result)
            res.send(result);
        })
       
    },
    getcustomers: (req,res) => {
        var username = req.body.username;
        var sql = `SELECT * FROM customers c join users u on c.id_agent = u.id where u.username='${username}';`;

        conn.query(sql, (err, result) => {
            if(err) throw err;
            res.send(result);
        })
        
    },
    getnews: (req,res) => {
        var sql = `SELECT * FROM news_users;`;

        conn.query(sql, (err, result) => {
            if(err) throw err;
            res.send(result);
        })
        
    },
    updatenews: (req,res) => {
        var news=req.body.news;
        var sql = `UPDATE news_users SET news="${news}" where id=1;`;

        conn.query(sql, (err, result) => {
            if(err) throw err;
            res.send(result);
        })
        
    },
    getcustomersid: (req,res) => {
        var username = req.body.username;
        var id =req.body.id
        var sql = `SELECT * FROM customers c join users u on c.id_agent = u.id where u.username='${username}' and c.id_customer = ${id};`;
        conn.query(sql, (err, result) => {
            if(err) throw err;
            res.send(result);
        })
        
    },
    addcustomer: (req,res) => {
                console.log(req.body.data) 
                const data = req.body           
                var sql = `INSERT INTO customers SET ?;`;
                conn.query(sql, data, (err, results) => {
                    console.log(data)
                    if(err) {
                        console.log(err.message)
                        return res.status(500).json({ message: "There's an error on the server. Please contact the administrator.", error: err.message });
                    }
                   
                    console.log(results);
                    sql = 'SELECT * from customers;';
                    conn.query(sql, (err, results) => {
                        if(err) {
                            console.log(err.message);
                            return res.status(500).json({ message: "There's an error on the server. Please contact the administrator.", error: err.message });
                        }
                        console.log(results);
                        
                        res.send(results);
                    });
                   
                });    
    },
    editcustomer:(req,res)=>{
        var id_customer = req.params.id_customer;
        const data= req.body  
        var sql = `SELECT * FROM customers WHERE id_customer = '${id_customer}';`;
        conn.query(sql, (err, results) => {
            if(err) throw err;
            if(results.length > 0) {
                    try {
                            sql = `UPDATE customers SET nama_lengkap='${data.nama_lengkap}', 
                                                alamat='${data.alamat}', 
                                                kecamatan='${data.kecamatan}', kota='${data.kota}',
                                                provinsi='${data.provinsi}', kodepos='${data.kodepos}',
                                                id_ktp='${data.id_ktp}', npwp='${data.npwp}',number='${data.number}'  WHERE id_customer = ${id_customer};`
                            console.log(sql)
                            conn.query(sql, (err1,results1) => {
                                if(err1) {
                                    return res.status(500).json({ message: "There's an error on the server. Please contact the administrator.", error: err1.message });
                                }
                                sql = `SELECT * FROM customers;`;
                                conn.query(sql, (err2,results2) => {
                                    if(err2) {
                                        return res.status(500).json({ message: "There's an error on the server. Please contact the administrator.", error: err1.message });
                                    }
    
                                    res.send(results2);
                                })
                              
                            })
                        
                    }
                    catch(err){
                        console.log(err.message)
                        return res.status(500).json({ message: "There's an error on the server. Please contact the administrator.", error: err.message });
                    }
            }
        })
    },
    deletecustomer: (req,res) => {
        
        var id_customer = req.params.id_customer;
       
        var sql = `SELECT * FROM customers WHERE id_customer = '${id_customer}';`;
        conn.query(sql, (err, results) => {
            if(err) {
                return res.status(500).json({ message: "There's an error on the server. Please contact the administrator.", error: err.message });
            }
            
            if(results.length > 0) {
                sql = `DELETE FROM customers WHERE id_customer = '${id_customer}';`
                conn.query(sql, (err1,results1) => {
                    if(err1) {
                        return res.status(500).json({ message: "There's an error on the server. Please contact the administrator.", error: err1.message });
                    }
                    sql = `SELECT * FROM customers;`;
                    conn.query(sql, (err2,results2) => {
                        if(err2) {
                            return res.status(500).json({ message: "There's an error on the server. Please contact the administrator.", error: err2.message });
                        }
    
                        res.send(results2);
                    })
                  
                })
            }
        })  
    },
    addfilebpom : (req,res) => {
        var id = req.params.id;
       
        var sql = `SELECT * FROM keranjang WHERE id = '${id}';`;
        conn.query(sql, (err, results) => {
            if(err) throw err;
    
            if(results.length > 0) {
                const path = '/files-doc-from-user/filebpom'; //file save path
                const upload = uploader(path, 'BPMFORM').fields([{ name: 'bpom'}]); //uploader(path, 'default prefix')
    
                upload(req, res, (err) => {
                    if(err){
                        console.log(err)
                        return res.status(500).json({ message: 'Upload file bpom failed !', error: err.message });
                    }
    
                    const { bpom } = req.files;
                   
                   console.log(bpom)
                    // console.log(image)
                    const filePath = bpom ? path + '/' + bpom[0].filename : null;
                   
                    try {
                        if(filePath) {
                            sql = `UPDATE keranjang SET bpom='${filePath}' WHERE id = '${id}';`
                            conn.query(sql, (err1,results1) => {
                                res.send(results1)
                            })
                        }
                    }
                    catch(err){
                        console.log(err.message)
                        return res.status(500).json({ message: "There's an error on the server. Please contact the administrator.", error: err.message });
                    }
                })
            }
        })
    },
}