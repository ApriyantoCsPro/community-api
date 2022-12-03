create table follows(
     id int not null auto_increment,
     follower_id int not null,
     followee_id int not null,
     createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
     primary key(id),
     constraint fk_followee_id_users foreign key (followee_id) references users(id),
     constraint fk_user_id_users foreign key (follower_id) references users(id)
     )engine = innodb;