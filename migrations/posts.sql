create table posts(
     id int not null auto_increment,
     user_id int not null,
     content varchar(50) not null,
     primary key(id),
     constraint fk_posts_users foreign key (user_id) references users(id)
     )engine = innodb;