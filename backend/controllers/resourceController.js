import { sql } from "../config/db.js";

export const getAllResource = async(req, res) => {
    try{
        const result = await sql`
            SELECT * FROM resource
            ORDER BY created_at DESC
        `;

        console.log("All resource data fetched.", result);
        res.status(200).json({success: true, data: result});
    }catch(err){
        console.log("Error in getAllResource! ", err);
        res.status(500).json({ success: false, message: "Internal server error"});
    }

};

export const getResource = async(req, res) => {
    const { id } = req.params;

    try{
        const result = await sql`
            SELECT * FROM resource WHERE id=${id}
        `;

        if(result.length === 0){
            return res.status(404).json({success:false, message: "ID does not exist"});
        }
        res.status(200).json({success: true, data: result[0]});
    }catch(err){
        console.log("Error in getResource!", err);
        res.status(500).json({success: false, message: "Internal server error"});
    }
};

export const createResource = async(req, res) => {
    const {name, image = null } = req.body;
    if(!name){
        return res.status(404).json({success: false, message: "name of resource not provided"});
    }
    try{
        const result = await sql`
            INSERT INTO resource(name, image)VALUES(${name}, ${image})
            RETURNING *
        `;
        res.status(201).json({success: true, data: result[0]});
    }catch(err){
        console.log("Error in create Resource!", err);
        res.status(500).json({success: false, message: "Internal server error"});  
    }

};  

export const updateResource = async(req, res) => {
    const { id } = req.params;
    const {name, image} = req.body;

    try{
        const result = await sql`
            UPDATE resource
            SET name = ${name}, image = ${image}
            WHERE id = ${id}
            RETURNING *
        `;  
        if(result.length === 0){
            return res.status(404).json({success: false, message: "Product not found!"});
        }
        res.status(200).json({success: true, data: result[0]});
    }catch(err){
        console.log("Error in update resource!", err);  
        res.status(500).json({success: false, message:"Internal server error"}); 
    }
};

export const deleteResource = async(req, res) => {
    const { id } = req.params;
    try{
        const result =  await sql`
            DELETE from resource
            WHERE id = ${id}
            RETURNING *
        `;
        if(result.length === 0){
            return res.status(404).json({success: false, message: "Resource not found"});
        }
        
        res.status(200).json({success: true, data: result[0]});

    }catch(err){
        console.log("Error in delete resource", err)
        res.status(500).json({success: false, message: "Internal server error"});
    }
};

