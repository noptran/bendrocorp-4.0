import { Field, FieldDescriptor, FieldValue } from './field.model';
import { Jurisdiction } from './law.model';
import { MasterId } from './master-id.model';
import { Base64Upload, FactionAffiliation, IdTitleDesc, IdTitleDescOrd } from './misc.model';
import { User } from './user.model';

export class StarObject {
    id?: string;
    title?: string;
    description?: string;
    tags?: string;
    object_type_id: string;
    kind: string;
    new_primary_image?: Base64Upload;
    primary_image_url?: string;
    primary_image_url_full?: string;
    draft: boolean;
    parent_id: string;
    parent: StarObject;
    children: StarObject[];
    object_type: IdTitleDesc;
    system_map_images: SystemImage[];
    field_values: FieldValue[];
    fields: Field[];
    master: MasterId;
    created_at: string;
}

export class StarObjectRule {
    parent_id: string;
    child_id: string;
}

export class SystemImage {
    id?: string;
    title?: string;
    description?: string;
    of_star_object_id?: string;
    created_by_id?: number;
    created_by?: User;
    new_image?: Base64Upload;
    image_url?: string;
    image_url_thumbnail?: string;
}
/*
export class StarSystem
{
    id?: string;
    title?: string;
    description?: string;
    tags?: string;
    planets?: Planet[];
    system_objects?: SystemObject[];
    jump_points?: JumpPoint[];
    gravity_wells?: GravityWell[];
    jurisdiction?: Jurisdiction;
    jurisdiction_id?: number;
    new_primary_image?: Base64Upload;
    primary_image_url?: string;
    primary_image_url_full?: string;

    faction_affiliation_id?: string;
    faction_affiliation?: FactionAffiliation;
}

export class GravityWell
{
    id?: string;
    title?: string;
    description?: string;
    tags?: string;
    new_primary_image?: Base64Upload;
    primary_image_url?: string;
    primary_image_url_full?: string;
    luminosity_class_id?: string;
    luminosity_class?: FieldDescriptor;
    gravity_well_type_id?: string;
    gravity_well_type?: FieldDescriptor;
    system_map_images?: SystemImage[];
    system_id: string;
    system: StarSystem;
}

export class Planet
{
    id?: string;
    title?: string;
    description?: string;
    tags?: string;
    moons?: Moon[];
    system_objects?: SystemObject[];
    locations?: SystemLocation[];
    orbits_system_id?: string;
    new_primary_image?: Base64Upload;
    primary_image_url?: string;
    primary_image_url_full?: string;
    system_map_images?: SystemImage[];
    atmospheric_height?: number;
    general_radiation?: number;
    economic_rating?: number;
    population_density?: number;
    minimum_criminality_rating?: number;
    jurisdiction?: Jurisdiction;
    jurisdiction_id?: number;
}

export class Moon
{
    id?: string;
    title?: string;
    description?: string;
    tags?: string;
    orbits_planet_id?: string;
    orbits_planet?: Planet;
    system_objects?: SystemObject[];
    settlements?: Settlement[];
    locations?: SystemLocation[];
    new_primary_image?: Base64Upload;
    primary_image_url?: string;
    primary_image_url_full?: string;
    system_map_images?: SystemImage[];
    atmospheric_height?: number;
    general_radiation?: number;
    economic_rating?: number;
    population_density?: number;
    minimum_criminality_rating?: number;
    jurisdiction?: Jurisdiction;
    jurisdiction_id?: number;
}

export class SystemObject
{
    id?: string;
    title?: string;
    description?: string;
    tags?: string;
    orbits_system_id?: string;
    orbits_planet_id?: string;
    orbits_moon_id?: string;
    locations?: SystemLocation[];
    new_primary_image?: Base64Upload;
    primary_image_url?: string;
    primary_image_url_full?: string;
    object_type_id?: string;
    object_type?: IdTitleDesc;
    system_map_images?: SystemImage[];
    jurisdiction?: Jurisdiction;
    jurisdiction_id?: number;
}

export class Settlement
{
    id?: string;
    title?: string;
    description?: string;
    tags?: string;
    system_map_images?: SystemImage[];
    on_planet_id?: string;
    on_moon_id?: string;
    new_primary_image?: Base64Upload;
    primary_image_url?: string;
    primary_image_url_full?: string;
    jurisdiction?: Jurisdiction;
    jurisdiction_id?: number;
    coordinates?: string;
    mission_givers?: MissionGiver[];
}

export class SystemLocation
{
    id?: string;
    title?: string;
    description?: string;
    tags?: string;
    system_map_images?: SystemImage[];
    on_planet_id?: string;
    on_moon_id?: string;
    on_system_object_id?: string;
    on_settlement_id?: string;
    new_primary_image?: Base64Upload;
    primary_image_url?: string;
    primary_image_url_full?: string;
    location_type?: IdTitleDesc;
    location_type_id?: number;
    coordinates?: string;
    mission_givers?: MissionGiver[];
}


export class JumpPoint
{
    id?: string;
    title?: string;
    description?: string;
    tags?: string;
    system_map_images?: SystemImage[];
    primary_image_one_url?: string;
    primary_image_one_url_full?: string;
    primary_image_two_url?: string;
    primary_image_two_url_full?: string;
    connection_size_id?: string;
    connection_size?: IdTitleDescOrd;
    connection_status_id?: string;
    connection_status?: IdTitleDescOrd;
    system_one?: StarSystem;
    system_one_id?: string;
    system_two?: StarSystem;
    system_two_id?: string;

    new_primary_image_one?: Base64Upload;
    new_primary_image_two?: Base64Upload;
}

export class SystemMapTypes
{
    gravity_well_types?: IdTitleDesc[]
    planetary_body_types?: IdTitleDesc[]
    moon_types?: IdTitleDesc[]
    gw_lum_classes?: IdTitleDesc[]
    jp_sizes?: IdTitleDesc[]
    jp_statues?: IdTitleDesc[]
    system_object_types?: IdTitleDesc[]
    location_types?: IdTitleDesc[]
}

export class MissionGiver
{
    id?: string;
    title?: string;
    description?: string;
    tags?: string;

    faction_affiliation_id?: string;
    faction_affiliation?: FactionAffiliation;

    new_primary_image: Base64Upload;
    system_map_images?: SystemImage[];

    primary_image_url?: string;
    primary_image_url_full?: string;

    on_system_object_id?: string;
    on_system_object?: SystemObject;
    on_location_id?: string;
    on_location?: SystemLocation;
    on_settlement_id?: string;
    on_settlement?: Settlement;
}

export class SystemMapSearchItem {
    id: string;
    parent_id: string;
    parent?: any;
    title: string;
    description: string;
    tags: string;
    kind: string;
    primary_image_url: string;
    primary_image_url_full: string;
    // specific sub-things, not everything will have all of these things...
    planets?: Planet[];
    moons?: Moon[];
    locations?: Location[];
    settlements?: Settlement[];
    mission_givers?: MissionGiver[];
    system_objects: SystemObject[];
    jump_points: JumpPoint[];
    object_type?: IdTitleDesc;
    object_type_id?: string;
    location_type?: IdTitleDesc;
    location_type_id?: string;
    system_map_images?: SystemImage[];
    faction_affiliation?: FactionAffiliation;
    faction_affiliation_id?: string;
    jurisdiction?: Jurisdiction;
    jurisdiction_id?: string;
    // planet/moon specific stuff
    atmospheric_height?: number;
    general_radiation?: number;
    economic_rating?: number;
    population_density?: number;
    minimum_criminality_rating?: number;

    type?: 'Planet'|'Moon'|'System Object'|'Location'|'Settlement'|'Mission Giver'
    hasPlanetParent?: boolean; // for locations, settlements and mission givers
    hasMoonParent?: boolean; // for locations, settlements and mission givers
  }*/
