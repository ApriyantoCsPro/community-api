create table posts (
	id int not null auto_increment,
    user_id int not null,
    content varchar(100) not null,
    createdAt timestamp default current_timestamp,
    updatedAt datetime default current_timestamp on update current_timestamp,
    deleted timestamp default null,
    constraint fk_posts_users foreign key(user_id) references users(id),
    primary key(id)
)engine = innodb; 