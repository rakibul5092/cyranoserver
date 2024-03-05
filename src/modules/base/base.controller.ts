import { Body, Delete, Get, Param, Post, Put, UseFilters } from '@nestjs/common';
import { ApiConsumes, ApiProduces } from '@nestjs/swagger';
import { MongoExceptionFilter } from "../shared/exceptions/mongo-exception-filter";

export class BaseController<T> {

    /***/
    constructor( public service: any ) {}

    /**
     * Find all entities
     */
    @Get()
    @ApiProduces( 'application/json' )
    async findAll(): Promise<T[]> {
        return this.service.findAll();
    }

    /**
     * Find entity by id
     *
     * @param id
     */
    @Get( ':id' )
    @ApiProduces( 'application/json' )
    async find( @Param( 'id' ) id: string ): Promise<T> {
        return this.service.findById( id );
    }

    /**
     * Save entity
     *
     * @param entity
     */
    @Post()
    @ApiConsumes( 'application/json' )
    @ApiProduces( 'application/json' )
    @UseFilters( MongoExceptionFilter )
    async save( @Body() entity: T ): Promise<T> {
        return this.service.save( entity );
    }

    /**
     * Update with Id
     *
     * @param id
     * @param entity
     */
    @Put( ':id' )
    @ApiConsumes( 'application/json' )
    @ApiProduces( 'application/json' )
    @UseFilters( MongoExceptionFilter )
    async update( @Param( 'id' ) id: string, @Body() entity: T ): Promise<T> {
        return this.service.update( id, entity );
    }

    /**
     * Delete with id
     *
     * @param id
     */
    @Delete( ':id' )
    async delete( @Param( 'id' ) id: string ): Promise<T> {
        return this.service.delete( id );
    }

}
