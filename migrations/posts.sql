create table posts (
	id int not null auto_increment,
    user_email varchar(15) not null,
    content varchar(100) not null,
    deleted timestamp default null,
    createdAt timestamp default current_timestamp,
    updatedAt datetime default current_timestamp on update current_timestamp,
    primary key(id)
)engine = innodb;