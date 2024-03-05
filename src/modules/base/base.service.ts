import { Model } from "mongoose";
import * as mongoose from 'mongoose';

export class BaseService<M, T> {

    /***/
    constructor( private model: Model<M> ) { }

    /**
     * Save entity
     *
     * @param userData
     */
    async save( userData: T ): Promise<any> {
        const createdModel = new this.model( userData );
        createdModel._id = new mongoose.Types.ObjectId();
        return await createdModel.save();
    }

    /**
     * Update entity
     *
     * @param id
     * @param data
     */
    async update( id: string, data: any ): Promise<any> {
        return this.model.findByIdAndUpdate( id, data, { new: true } );
    }

    /**
     * Delete entity
     *
     * @param id
     */
    async delete( id: string ): Promise<any> {
        return this.model.findByIdAndRemove( id );
    }

    /**
     * List of entities
     */
    async findAll(): Promise<any[]> {
        return this.model.find().exec();
    }

    /**
     * Find entity by id
     *
     * @param id
     */
    async findById( id: string ): Promise<any> {
        return this.model.findById( id ).exec();
    }

    /**
     * Find entity
     *
     * @param query
     * @param populate
     */
    async findOne( query: any, populate?: string ): Promise<any> {
        return this.model.findOne( query, { strictQuery: false } ).populate( populate );
    }

    /**
     * Find entity and update
     *
     * @param query
     * @param entity
     */
    async findOneAndUpdate( query, entity: T ): Promise<any> {
        return this.model.findOneAndUpdate( query, entity, {
            new    : true,
            upsert : true
        } );
    }

    /**
     * Find entity and delete
     *
     * @param query
     */
    async findOneAndDelete( query ): Promise<T> {
        return this.model.findOneAndDelete( query );
    }

    /**
     * Find by query
     *
     * @param query
     * @param limit
     */
    async find( query:any, limit?:number ): Promise<any[]> {
        return limit && limit > 0 ? this.model.find( query ).limit( limit ) : this.model.find( query );
    }

}
