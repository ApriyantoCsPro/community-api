create table likes(
     id int not null auto_increment,
     user_id int not null,
     target_id int not null,
     target_type varchar(10) not null,
     createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
     primary key(id),
     constraint fk_likes_users foreign key(user_id) references users(id),
     constraint fk_likes_comments foreign key (target_id) references comments(id),
     constraint fk_likes_posts foreign key (target_id) references posts(id)
     )engine = innodb;