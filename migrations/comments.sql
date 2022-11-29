  create table comments(
     id int not null auto_increment,
     user_id int not null,
     post_id int not null,
     comment varchar(50) not null,
     primary key(id),
     constraint fk_comments_users foreign key (user_id) references users(id)
     )engine = innodb;