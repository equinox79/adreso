package Adreso::Pages;
use strict;
use warnings;
use Data::Printer;
use Data::Dumper;
use Encode;
use WebService::Simple;
use URI::Escape;
use JSON;
use utf8;

sub index {
    my ( $req, $params ) = @_;
    my $page  = {
        template => 'index.tx',
        title    => 'adre.so',
    };

    my $query = &query_parse($params->{q});

    # 住所の時は正規化APIを叩く
    if ( $query->{type} eq 'addr' ) {
        $page->{addr} = $query->{parts}[0];
    }
    elsif ( $query->{type} eq 'latlon' ) {
        $page->{addr} = $query->{query_string};
    }
    else {

    }

    return $page;
}

sub query_parse {
    my ($q) = @_;
    $q = &decode( 'utf8', $q );

    my $query_obj = { parts => [], type => undef, query_string => $q };
    if ( @{ $query_obj->{parts} } =
        $q =~ /^([-]?\d+(?:\.\d+)?),([-]?\d+(?:\.\d+)?)$/ )
    {
        $query_obj->{type} = 'latlon';
    }
    elsif ( @{ $query_obj->{parts} } = $q =~ /(.+)/ ) {
        $query_obj->{type} = 'addr';
    }

    return $query_obj;
}

1
__END__
