const conn = require('../database');
var fs = require('fs');
var { uploader } = require('../helpers/uploader');

module.exports = {
    searchproduct: (req,res) => {
        var { keyword = ""} = req.body;

        var splitString = (strSearch) => {
            var result = strSearch.split(' ');
            return result;
        }

        

        var resKeyword = splitString(keyword).join('|');
        console.log(resKeyword);
        if(resKeyword == "") {resKeyword = "|"}
       
        var sql = `SELECT p.nama_produk, p.harga, p.gambar,p.berat, p.deskripsi, p.id, kt.nama as nama_kategori, n.negara as nama_negara FROM produk p 
                    LEFT JOIN kategori kt on kt.id = p.id_kategori 
                    LEFT JOIN negara n on n.id = p.id_negara
                    WHERE p.id = '${resKeyword}'  AND verified = '2'
                    OR ( nama_produk REGEXP '${resKeyword}' 
                    OR deskripsi REGEXP '${resKeyword}')`;
        conn.query(sql, (err, result) => {
            if(err) throw err;
            console.log(result)
            res.send(result);
        })
       
    },
    getproduct: (req,res) => {

       
        var sql =  `SELECT PRD.id, 
                        nama_produk, 
                        harga, 
                        berat, 
                        deskripsi, 
                        PRD.gambar,
                        PRD.limited,
                        PRD.best,
                        PRD.offer, 
                        NG.id AS id_negara, 
                        NG.negara AS nama_negara, 
                        CT.id AS id_kategori, 
                        CT.nama AS nama_kategori 
                    FROM produk PRD
                    JOIN negara NG ON PRD.id_negara = NG.id 
                    JOIN kategori CT ON PRD.id_kategori = CT.id
                    WHERE PRD.verified = '2'`;

        conn.query(sql, (err, result) => {
            if(err) throw err;
            console.log(sql)
            res.send(result);
        })
       
    },
    getproductbest: (req,res) => {

       
        var sql =  `SELECT PRD.id, 
                        nama_produk, 
                        harga, 
                        berat, 
                        deskripsi, 
                        PRD.gambar,
                        PRD.limited,
                        PRD.best,
                        PRD.offer, 
                        NG.id AS id_negara, 
                        NG.negara AS nama_negara, 
                        CT.id AS id_kategori, 
                        CT.nama AS nama_kategori 
                    FROM produk PRD
                    JOIN negara NG ON PRD.id_negara = NG.id 
                    JOIN kategori CT ON PRD.id_kategori = CT.id
                    where PRD.best='best' AND PRD.verified = '2' `;

        conn.query(sql, (err, result) => {
            if(err) throw err;
            console.log(sql)
            res.send(result);
        })
       
    },
    getproductoffer: (req,res) => {

       
        var sql =  `SELECT PRD.id, 
                        nama_produk, 
                        harga, 
                        berat, 
                        deskripsi, 
                        PRD.gambar,
                        PRD.limited,
                        PRD.best,
                        PRD.offer, 
                        NG.id AS id_negara, 
                        NG.negara AS nama_negara, 
                        CT.id AS id_kategori, 
                        CT.nama AS nama_kategori 
                    FROM produk PRD
                    JOIN negara NG ON PRD.id_negara = NG.id 
                    JOIN kategori CT ON PRD.id_kategori = CT.id
                    where PRD.offer ='best' AND PRD.verified = '2' `;

        conn.query(sql, (err, result) => {
            if(err) throw err;
            console.log(sql)
            res.send(result);
        })
       
    },
    getproductdetail : (req,res) => {
       
        var sql = `SELECT 
        p.id as id,
        p.nama_produk as nama_produk,
        p.harga as harga,
        p.berat as berat,
        p.deskripsi as deskripsi,
        p.limited,
        n.negara as negara,
        k.nama as kategori,
        p.gambar as gambar,
        p.gambar2 as gambar2,
        p.gambar3 as gambar3,
        p.gambar4 as gambar4
        FROM produk p
        join kategori k on k.id = p.id_kategori
        join negara n on n.id = p.id_negara
        WHERE p.id='${req.params.id}';`;
        console.log(sql)
        conn.query(sql, (err, result) => {
            if(err) throw err;
            console.log(result)
            res.send(result);
        })
       
    },
    addproduct: (req,res) => {
        try {
            const path = '/images/produk'; //file save path
            const upload = uploader(path, 'PRD').fields([{ name: 'gambar'}]); //uploader(path, 'default prefix')
    
            upload(req, res, (err) => {
                if(err){
                    return res.status(500).json({ message: 'Upload picture failed !', error: err.message });
                }
    
                const { gambar } = req.files;
                console.log(gambar)
                const imagePath = gambar ? path + '/' + gambar[0].filename : null;
                console.log(imagePath)
    
                console.log(req.body.data)
                //req.body.data.input_date = new Date();
                const data = JSON.parse(req.body.data);
                console.log(data)
                data.gambar = imagePath;                
                
                var sql = 'INSERT INTO produk SET ?';
                conn.query(sql, data, (err, results) => {
                    console.log(data)
                    if(err) {
                        console.log(err.message)
                        fs.unlinkSync('./public' + imagePath);
                        return res.status(500).json({ message: "There's an error on the server. Please contact the administrator.", error: err.message });
                    }
                   
                    console.log(results);
                    sql = `SELECT * from produk WHERE verified = '2';`;
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
    // =============================================================================
    addrequestproduct: (req,res) => {
        try {
            const path = '/images/requestproduk'; //file save path
            const upload = uploader(path, 'PRD').fields([{ name: 'gambar'}]); //uploader(path, 'default prefix')
    
            upload(req, res, (err) => {
                if(err){
                    return res.status(500).json({ message: 'Upload picture failed !', error: err.message });
                }
    
                const { gambar } = req.files;
                console.log(gambar)
                const imagePath = gambar ? path + '/' + gambar[0].filename : null;
                console.log(imagePath)
    
                console.log(req.body.data)
                //req.body.data.input_date = new Date();
                const data = JSON.parse(req.body.data);
                console.log(data)
                data.gambar = imagePath;                
                
                var sql = 'INSERT INTO request_produk SET ?';
                conn.query(sql, data, (err, results) => {
                    console.log(data)
                    if(err) {
                        console.log(err.message)
                        fs.unlinkSync('./public' + imagePath);
                        return res.status(500).json({ message: "There's an error on the server. Please contact the administrator.", error: err.message });
                    }
                   
                    console.log(results);
                    sql = 'SELECT * from request_produk;';
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
    // =============================================================================
    editproduct : (req,res) => {
        var id = req.params.id;
       const data=req.body.data
       
       console.log(data)

        sql = `UPDATE produk SET id="${data.id}", nama_produk="${data.nama_produk}",
                                                harga=${parseFloat(data.harga)}, 
                                                berat=${parseInt(data.berat)}, 
                                                deskripsi="${data.deskripsi}", id_negara="${data.id_negara}",
                                                id_kategori="${data.id_kategori}", limited="${data.limited}", best="${data.best}", offer="${data.offer}" WHERE id = "${id}";`
        // console.log(sql)
        conn.query(sql, (err1,result) => {
            if(err1) {
                console.log(err1)
                return res.status(500).json({ message: "There's an error on the server. Please contact the administrator.", error: err1.message });
            }
            res.send(result);
    })
},
    // =============================================================================
    editRequestproduct : (req,res) => {
        var id = req.body.id;
        var status =req.body.status
        var kode  = req.body.kode
        sql = `UPDATE request_produk SET status="${status}", kode_barang="${kode}" WHERE id = "${id}";`
        // console.log(sql)
        conn.query(sql, (err1,result) => {
            if(err1) {
                console.log(err1)
                return res.status(500).json({ message: "There's an error on the server. Please contact the administrator.", error: err1.message });
            }
            res.send(result);
    })
},
    // =============================================================================
    deleteproduct: (req,res) => {
        
        var id = req.params.id;
       
        var sql = `SELECT * FROM produk WHERE id = '${id}' AND verified = '2' `;
        conn.query(sql, (err, results) => {
            if(err) {
                return res.status(500).json({ message: "There's an error on the server. Please contact the administrator.", error: err.message });
            }
            
            if(results.length > 0) {
                sql = `DELETE FROM produk WHERE id = '${id}' AND verified = '2' `
                conn.query(sql, (err1,results1) => {
                    if(err1) {
                        return res.status(500).json({ message: "There's an error on the server. Please contact the administrator.", error: err1.message });
                    }
    
                    fs.unlinkSync('./public' + results[0].gambar);
                    sql = `SELECT * FROM buku;`;
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
    getcountry: (req,res) => {
        var sql =  `select * from negara limit 6;`;
        conn.query(sql, (err, result) => {
            if(err) throw err;
            console.log(sql)
            res.send(result);
        })
       
    },
    getproductrequest: (req,res) => {
        var sql =  `SELECT * FROM request_produk WHERE status = '-';`;
        conn.query(sql, (err, result) => {
            if(err) throw err;
            console.log(sql)
            res.send(result);
        })
       
    },
    getproductrequestbyuser: (req,res) => {
        var sql =  `select * from request_produk where id_user=${req.params.id_user};`;
        conn.query(sql, (err, result) => {
            if(err) throw err;
            console.log(sql)
            res.send(result);
        })
       
    },
    getallcountry: (req,res) => {
        var sql =  `select * from negara;`;
        conn.query(sql, (err, result) => {
            if(err) throw err;
            console.log(sql)
            res.send(result);
        })
       
    },
    getallcategory: (req,res) => {
        var sql =  `select * from kategori;`;
        conn.query(sql, (err, result) => {
            if(err) throw err;
            console.log(sql)
            res.send(result);
        })
       
    },
    getproductcountry: (req,res) => {

       
        var sql =  `SELECT PRD.id, 
                        nama_produk, 
                        harga, 
                        berat, 
                        deskripsi, 
                        PRD.gambar,
                        PRD.limited, 
                        NG.id AS id_negara, 
                        NG.negara AS nama_negara, 
                        CT.id AS id_kategori, 
                        CT.nama AS nama_kategori 
                    FROM produk PRD
                    JOIN negara NG ON PRD.id_negara = NG.id 
                    JOIN kategori CT ON PRD.id_kategori = CT.id
                    WHERE NG.negara = '${req.params.negara}';`;

        conn.query(sql, (err, result) => {
            if(err) throw err;
            console.log(sql)
            res.send(result);
        })
       
    },
    getproductcountrylowestprice: (req,res) => {

       
        var sql =  `SELECT PRD.id, 
        nama_produk, 
        harga, 
        berat, 
        deskripsi, 
        PRD.gambar,
        PRD.limited, 
        NG.id AS id_negara, 
        NG.negara AS nama_negara, 
        CT.id AS id_kategori, 
        CT.nama AS nama_kategori 
    FROM produk PRD
    JOIN negara NG ON PRD.id_negara = NG.id 
    JOIN kategori CT ON PRD.id_kategori = CT.id
    WHERE NG.negara = '${req.params.negara}' ORDER BY harga asc;`;

        conn.query(sql, (err, result) => {
            if(err) throw err;
            console.log(sql)
            res.send(result);
        })
       
    },
    getproductcountryhighestprice: (req,res) => {

       
        var sql =  `SELECT PRD.id, 
        nama_produk, 
        harga, 
        berat, 
        deskripsi, 
        PRD.gambar,
        PRD.limited, 
        NG.id AS id_negara, 
        NG.negara AS nama_negara, 
        CT.id AS id_kategori, 
        CT.nama AS nama_kategori 
    FROM produk PRD
    JOIN negara NG ON PRD.id_negara = NG.id 
    JOIN kategori CT ON PRD.id_kategori = CT.id
    WHERE NG.negara = '${req.params.negara}' ORDER BY harga desc;`;

        conn.query(sql, (err, result) => {
            if(err) throw err;
            console.log(sql)
            res.send(result);
        })
       
    },
    getproductcountrylowestweight: (req,res) => {

       
        var sql =  `SELECT PRD.id, 
        nama_produk, 
        harga, 
        berat, 
        deskripsi, 
        PRD.gambar,
        PRD.limited, 
        NG.id AS id_negara, 
        NG.negara AS nama_negara, 
        CT.id AS id_kategori, 
        CT.nama AS nama_kategori 
    FROM produk PRD
    JOIN negara NG ON PRD.id_negara = NG.id 
    JOIN kategori CT ON PRD.id_kategori = CT.id
    WHERE NG.negara = '${req.params.negara}' ORDER BY berat asc;`;

        conn.query(sql, (err, result) => {
            if(err) throw err;
            console.log(sql)
            res.send(result);
        })
       
    },
    getproductcountryhighestweight: (req,res) => {

       
        var sql =  `SELECT PRD.id, 
        nama_produk, 
        harga, 
        berat, 
        deskripsi, 
        PRD.gambar,
        PRD.limited, 
        NG.id AS id_negara, 
        NG.negara AS nama_negara, 
        CT.id AS id_kategori, 
        CT.nama AS nama_kategori 
    FROM produk PRD
    JOIN negara NG ON PRD.id_negara = NG.id 
    JOIN kategori CT ON PRD.id_kategori = CT.id
    WHERE NG.negara = '${req.params.negara}' ORDER BY berat desc;`;

        conn.query(sql, (err, result) => {
            if(err) throw err;
            console.log(sql)
            res.send(result);
        })
       
    },
    getproductcountryaz: (req,res) => {

       
        var sql =  `SELECT PRD.id, 
        nama_produk, 
        harga, 
        berat, 
        deskripsi, 
        PRD.gambar,
        PRD.limited, 
        NG.id AS id_negara, 
        NG.negara AS nama_negara, 
        CT.id AS id_kategori, 
        CT.nama AS nama_kategori 
    FROM produk PRD
    JOIN negara NG ON PRD.id_negara = NG.id 
    JOIN kategori CT ON PRD.id_kategori = CT.id
    WHERE NG.negara = '${req.params.negara}' ORDER BY nama_produk asc;`;

        conn.query(sql, (err, result) => {
            if(err) throw err;
            console.log(sql)
            res.send(result);
        })
       
    },
    getproductcountryza: (req,res) => {

       
        var sql =  `SELECT PRD.id, 
        nama_produk, 
        harga, 
        berat, 
        deskripsi, 
        PRD.gambar,
        PRD.limited, 
        NG.id AS id_negara, 
        NG.negara AS nama_negara, 
        CT.id AS id_kategori, 
        CT.nama AS nama_kategori 
    FROM produk PRD
    JOIN negara NG ON PRD.id_negara = NG.id 
    JOIN kategori CT ON PRD.id_kategori = CT.id
    WHERE NG.negara = '${req.params.negara}' ORDER BY nama_produk desc;`;

        conn.query(sql, (err, result) => {
            if(err) throw err;
            console.log(sql)
            res.send(result);
        })
       
    },
    getproductcountryandcategory: (req,res) => {
        var {negara,id}=req.body
       
        var sql =  `SELECT PRD.id, 
                        nama_produk, 
                        harga, 
                        berat, 
                        deskripsi, 
                        PRD.gambar, 
                        PRD.limited, 
                        NG.id AS id_negara, 
                        NG.negara AS nama_negara, 
                        CT.id AS id_kategori, 
                        CT.nama AS nama_kategori 
                    FROM produk PRD
                    JOIN negara NG ON PRD.id_negara = NG.id 
                    JOIN kategori CT ON PRD.id_kategori = CT.id
                    WHERE NG.negara = '${negara}' and CT.id =${id};`;

        conn.query(sql, (err, result) => {
            if(err) throw err;
            console.log(sql)
            res.send(result);
        })
       
    },
    deletecategory: (req,res) => {
        
        var id = req.params.id;
       
        var sql = `SELECT * FROM kategori WHERE id = ${id};`;
        conn.query(sql, (err, results) => {
            if(err) {
                return res.status(500).json({ message: "There's an error on the server. Please contact the administrator.", error: err.message });
            }
            
            if(results.length > 0) {
                sql = `DELETE FROM kategori WHERE id = ${id};`
                conn.query(sql, (err1,results1) => {
                    if(err1) {
                        return res.status(500).json({ message: "There's an error on the server. Please contact the administrator.", error: err1.message });
                    }
    
                    sql = `SELECT * FROM kategori;`;
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
    editlistcategory: (req, res) => {
        var { nama, kode} = req.body;
        var sql = `UPDATE kategori SET nama = '${nama}', kode = '${kode}' WHERE id = '${req.params.id}' ;`;
        conn.query(sql, (err, result) => {
            if(err) throw err;
            res.send(result);
        })
       
    },
    addcategory: (req, res) => {
       var data ={
           nama:req.body.nama,
           kode:req.body.kode
       }
        var datas = req.body.datas
        if(data.nama != null){
            var sql = `INSERT INTO kategori SET ?;`;
            conn.query(sql, data,(err, result) => {
                if(err) throw err;
                res.send(result);
            })    
        }else{
            for(let i = 0; i < datas.length; i++){
                var sql = `INSERT INTO kategori SET ?;`;
                conn.query(sql, datas[i],(err, result) => {
                    if(err) throw err;
                    
                })
            }
            res.send("Berhasil");
        }
        
    },
    deletecountry: (req,res) => {
        
        var id = req.params.id;
       
        var sql = `SELECT * FROM negara WHERE id = '${id}';`;
        conn.query(sql, (err, results) => {
            if(err) {
                return res.status(500).json({ message: "There's an error on the server. Please contact the administrator.", error: err.message });
            }
            
            if(results.length > 0) {
                sql = `DELETE FROM negara WHERE id = '${id};`
                conn.query(sql, (err1,results1) => {
                    if(err1) {
                        return res.status(500).json({ message: "There's an error on the server. Please contact the administrator.", error: err1.message });
                    }
    
                    sql = `SELECT * FROM negara;`;
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
    addcountry: (req,res) => {
        try {
            const path = '/images/negara'; //file save path
            const upload = uploader(path, 'PRD').fields([{ name: 'gambar'}]); //uploader(path, 'default prefix')
    
            upload(req, res, (err) => {
                if(err){
                    return res.status(500).json({ message: 'Upload picture failed !', error: err.message });
                }
    
                const { gambar } = req.files;
                console.log(gambar)
                const imagePath = gambar ? path + '/' + gambar[0].filename : null;
                console.log(imagePath)
    
                console.log(req.body.data)
                //req.body.data.input_date = new Date();
                const data = JSON.parse(req.body.data);
                console.log(data)
                data.gambar = imagePath;                
                
                var sql = 'INSERT INTO negara SET ?';
                conn.query(sql, data, (err, results) => {
                    console.log(data)
                    if(err) {
                        console.log(err.message)
                        fs.unlinkSync('./public' + imagePath);
                        return res.status(500).json({ message: "There's an error on the server. Please contact the administrator.", error: err.message });
                    }
                   
                    console.log(results);
                    sql = 'SELECT * from negara;';
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
    editCountry : (req,res) => {
        var id = req.params.id;
       
        var sql = `SELECT * FROM negara WHERE id = '${id}';`;
        conn.query(sql, (err, results) => {
            if(err) throw err;
    
            if(results.length > 0) {
                const path = '/images/negara'; //file save path
                const upload = uploader(path, 'PRD').fields([{ name: 'gambar'}]); //uploader(path, 'default prefix')
    
                upload(req, res, (err) => {
                    if(err){
                        return res.status(500).json({ message: 'Upload book picture failed !', error: err.message });
                    }
    
                    const { gambar } = req.files;
                    // console.log(image)
                    const imagePath = gambar ? path + '/' + gambar[0].filename : null;
                    const data = JSON.parse(req.body.data);
                    data.gambar = imagePath;
    
                    try {
                        if(imagePath) {
                            sql = `UPDATE negara SET ? WHERE id = '${id}';`
                            conn.query(sql,data, (err1,results1) => {
                                if(err1) {
                                    fs.unlinkSync('./public' + imagePath);
                                    return res.status(500).json({ message: "There's an error on the server. Please contact the administrator.", error: err1.message });
                                }
                                fs.unlinkSync('./public' + results[0].gambar);
                                sql = `SELECT * FROM negara;`;
                                conn.query(sql, (err2,results2) => {
                                    if(err2) {
                                        return res.status(500).json({ message: "There's an error on the server. Please contact the administrator.", error: err1.message });
                                    }
    
                                    res.send(results2);
                                })
                                
                            })
                        }
                        else {
                            sql = `UPDATE negara SET id='${data.id}',negara='${data.negara}' WHERE id = '${id}';`
                            console.log(sql)
                            conn.query(sql, (err1,results1) => {
                                if(err1) {
                                    return res.status(500).json({ message: "There's an error on the server. Please contact the administrator.", error: err1.message });
                                }
                                sql = `SELECT * FROM negara;`;
                                conn.query(sql, (err2,results2) => {
                                    if(err2) {
                                        return res.status(500).json({ message: "There's an error on the server. Please contact the administrator.", error: err1.message });
                                    }
    
                                    res.send(results2);
                                })
                              
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
    getpricing: (req,res) => {
        var sql =  `SELECT *
                    FROM paket;`;
        conn.query(sql, (err, result) => {
            if(err) throw err;
            res.send(result);
        })
       
    },
    getdatapricing: (req,res) => {
        var sql =  `SELECT *
                    FROM paket 
                    WHERE id= ${req.params.id};`;
        conn.query(sql, (err, result) => {
            if(err) throw err;
            res.send(result);
        })
       
    },
    getbank: (req,res) => {
        var sql =  `SELECT *
                    FROM noRek ;`;
        conn.query(sql, (err, result) => {
            if(err) throw err;
            res.send(result);
        })
       
    },
    deletedatabank: (req,res) => {
        var id = req.body.id
        var sql =  `DELETE FROM noRek WHERE id = ${id} ;`;
        conn.query(sql, (err, result) => {
            if(err) throw err;
            res.send(result);
        })
       
    },
     // =============================================================================
     AddImage1 : (req,res) => {
        var id = req.params.id;
       
        var sql = `SELECT * FROM produk WHERE id = '${id}' AND verified = '2' `;
        conn.query(sql, (err, results) => {
            if(err) throw err;
    
            if(results.length > 0) {
                const path = '/images/produk'; //file save path
                const upload = uploader(path, 'PRD').fields([{ name: 'gambar'}]); //uploader(path, 'default prefix')
    
                upload(req, res, (err) => {
                    if(err){
                        return res.status(500).json({ message: 'Upload product picture failed !', error: err.message });
                    }
    
                    const { gambar } = req.files;
                    // console.log(image)
                    const imagePath = gambar ? path + '/' + gambar[0].filename : null;
                    try {
                        if(imagePath) {
                            sql = `UPDATE produk SET gambar='${imagePath}' WHERE id = '${id}';`
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
    AddImage2 : (req,res) => {
        var id = req.params.id;
       
        var sql = `SELECT * FROM produk WHERE id = '${id}' AND verified = '2' `;
        conn.query(sql, (err, results) => {
            if(err) throw err;
    
            if(results.length > 0) {
                const path = '/images/produk'; //file save path
                const upload = uploader(path, 'PRD').fields([{ name: 'gambar2'}]); //uploader(path, 'default prefix')
    
                upload(req, res, (err) => {
                    if(err){
                        return res.status(500).json({ message: 'Upload product picture failed !', error: err.message });
                    }
    
                    const { gambar2 } = req.files;
                    console.log(gambar2+ ' fikar')
                    // console.log(image)
                    const imagePath = gambar2 ? path + '/' + gambar2[0].filename : null;
                    console.log(imagePath)
                    try {
                        if(imagePath) {
                            sql = `UPDATE produk SET gambar2='${imagePath}' WHERE id = '${id}';`
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
    AddImage3 : (req,res) => {
        var id = req.params.id;
       
        var sql = `SELECT * FROM produk WHERE id = '${id}' AND verified = '2' `;
        conn.query(sql, (err, results) => {
            if(err) throw err;
    
            if(results.length > 0) {
                const path = '/images/produk'; //file save path
                const upload = uploader(path, 'PRD').fields([{ name: 'gambar3'}]); //uploader(path, 'default prefix')
    
                upload(req, res, (err) => {
                    if(err){
                        return res.status(500).json({ message: 'Upload product picture failed !', error: err.message });
                    }
    
                    const { gambar3 } = req.files;
                    console.log(gambar3+ ' fikar')
                    // console.log(image)
                    const imagePath = gambar3 ? path + '/' + gambar3[0].filename : null;
                    console.log(imagePath)
                    try {
                        if(imagePath) {
                            sql = `UPDATE produk SET gambar3='${imagePath}' WHERE id = '${id}';`
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
    AddImage4 : (req,res) => {
        var id = req.params.id;
       
        var sql = `SELECT * FROM produk WHERE id = '${id}' AND verified = '2' `;
        conn.query(sql, (err, results) => {
            if(err) throw err;
    
            if(results.length > 0) {
                const path = '/images/produk'; //file save path
                const upload = uploader(path, 'PRD').fields([{ name: 'gambar4'}]); //uploader(path, 'default prefix')
    
                upload(req, res, (err) => {
                    if(err){
                        return res.status(500).json({ message: 'Upload product picture failed !', error: err.message });
                    }
    
                    const { gambar4 } = req.files;
                    console.log(gambar4+ ' fikar')
                    // console.log(image)
                    const imagePath = gambar4 ? path + '/' + gambar4[0].filename : null;
                    console.log(imagePath)
                    try {
                        if(imagePath) {
                            sql = `UPDATE produk SET gambar4='${imagePath}' WHERE id = '${id}';`
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
    // =============================================================================
    AddImagecarousell1 : (req,res) => {
        var id = req.params.id;
       
        var sql = `SELECT * FROM carousell WHERE id = '${id}';`;
        conn.query(sql, (err, results) => {
            if(err) throw err;
    
            if(results.length > 0) {
                const path = '/images/carousell'; //file save path
                const upload = uploader(path, 'PRD').fields([{ name: 'gambar'}]); //uploader(path, 'default prefix')
    
                upload(req, res, (err) => {
                    if(err){
                        return res.status(500).json({ message: 'Upload product picture failed !', error: err.message });
                    }
    
                    const { gambar } = req.files;
                    // console.log(image)
                    const imagePath = gambar ? path + '/' + gambar[0].filename : null;
                    try {
                        if(imagePath) {
                            sql = `UPDATE carousell SET gambar='${imagePath}' WHERE id = '${id}';`
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
    AddImagecarousell2 : (req,res) => {
        var id = req.params.id;
       
        var sql = `SELECT * FROM carousell WHERE id = '${id}';`;
        conn.query(sql, (err, results) => {
            if(err) throw err;
    
            if(results.length > 0) {
                const path = '/images/carousell'; //file save path
                const upload = uploader(path, 'PRD').fields([{ name: 'gambar'}]); //uploader(path, 'default prefix')
    
                upload(req, res, (err) => {
                    if(err){
                        return res.status(500).json({ message: 'Upload product picture failed !', error: err.message });
                    }
    
                    const { gambar } = req.files;
                    console.log(gambar+ ' fikar')
                    // console.log(image)
                    const imagePath = gambar ? path + '/' + gambar[0].filename : null;
                    console.log(imagePath)
                    try {
                        if(imagePath) {
                            sql = `UPDATE carousell SET gambar='${imagePath}' WHERE id = '${id}';`
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
    AddImagecarousell3 : (req,res) => {
        var id = req.params.id;
       
        var sql = `SELECT * FROM carousell WHERE id = '${id}';`;
        conn.query(sql, (err, results) => {
            if(err) throw err;
    
            if(results.length > 0) {
                const path = '/images/carousell'; //file save path
                const upload = uploader(path, 'PRD').fields([{ name: 'gambar'}]); //uploader(path, 'default prefix')
    
                upload(req, res, (err) => {
                    if(err){
                        return res.status(500).json({ message: 'Upload product picture failed !', error: err.message });
                    }
    
                    const { gambar } = req.files;
                    console.log(gambar+ ' fikar')
                    // console.log(image)
                    const imagePath = gambar ? path + '/' + gambar[0].filename : null;
                    console.log(imagePath)
                    try {
                        if(imagePath) {
                            sql = `UPDATE carousell SET gambar='${imagePath}' WHERE id = '${id}';`
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
    getcarousell: (req,res) => {

       
        var sql =  `select * from carousell;`;

        conn.query(sql, (err, result) => {
            if(err) throw err;
            res.send(result);
        })
       
    },

    getRequestShopper: (req, res) => {
        
        
        var sql = `
        SELECT * FROM request_produk rp 
        LEFT JOIN personalshopper ps on ps.id_user = ${req.params.id_shopper} 
        WHERE rp.id_negara = ps.id_negara AND rp.status = '-'`

        conn.query(sql, (err, result) => {

            if(err) throw err
            res.send(result)

        })


    },

    getProduktoVerified: (req, res) => {


        var sql = `SELECT * FROM produk
        LEFT JOIN request_produk rq on rq.kode_barang = produk.id
        LEFT JOIN kategori kt on kt.id = produk.id_kategori 
        WHERE verified = 1`;

        conn.query(sql, (err, result) => {
            if(err) throw err

            res.send(result)

        })
            

    },

    editRequestproductAdmin : (req,res) => {
        var id = req.body.id;
        var status =req.body.status
        var kode  = req.body.kode
        sql = `UPDATE request_produk SET status="${status}" WHERE kode_barang = "${id}";`
        // console.log(sql)
        conn.query(sql, (err1,result) => {
            if(err1) {
                console.log(err1)
                return res.status(500).json({ message: "There's an error on the server. Please contact the administrator.", error: err1.message });
            }

            var sqlu = `UPDATE produk SET verified = '2' WHERE id = "${id}"`
            conn.query(sqlu, (err, result2) => {

                if(err) throw err

            })

            res.send(result);
        })
    },

    getoneCategory: (req, res) => {

        var sql = `SELECT kt.id FROM kategori kt WHERE kt.kode = '${req.params.id_kate}'`;

        conn.query(sql, (err, result) => {
            if(err) throw err;
            res.send(result)
        })

    },

    getoneCountry:(req, res) => {

        var sql = `SELECT ng.id FROM negara ng WHERE ng.kode = '${req.params.id_negara}'`;

        conn.query(sql, (err, result) => {

            if(err) throw err;
            res.send(result)

        })

    },


    addWarna: (req, res) => {

        var { id_produk, nama} = req.body
        var sqlw = `INSERT INTO warna SET ?`

        var data = {

            id_produk: id_produk,
            nama: nama

        }

        conn.query(sqlw, data, (err, result) => {
            if(err) throw err
            res.send(result)
        })


    }

}